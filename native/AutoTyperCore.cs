using System;
using System.IO;
using System.Text;
using System.Threading;
using System.Runtime.InteropServices;

namespace SmartAutoTyper
{
    class Program
    {
        [DllImport("user32.dll", SetLastError = true)]
        static extern uint SendInput(uint nInputs, [MarshalAs(UnmanagedType.LPArray), In] INPUT[] pInputs, int cbSize);

        [DllImport("user32.dll")]
        static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
        static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

        [StructLayout(LayoutKind.Sequential)]
        struct INPUT
        {
            public uint type;
            public InputUnion u;
        }

        [StructLayout(LayoutKind.Explicit)]
        struct InputUnion
        {
            [FieldOffset(0)] public MOUSEINPUT mi;
            [FieldOffset(0)] public KEYBDINPUT ki;
            [FieldOffset(0)] public HARDWAREINPUT hi;
        }

        [StructLayout(LayoutKind.Sequential)]
        struct KEYBDINPUT
        {
            public ushort wVk;
            public ushort wScan;
            public uint dwFlags;
            public uint time;
            public IntPtr dwExtraInfo;
        }

        [StructLayout(LayoutKind.Sequential)]
        struct MOUSEINPUT
        {
            public int dx;
            public int dy;
            public uint mouseData;
            public uint dwFlags;
            public uint time;
            public IntPtr dwExtraInfo;
        }

        [StructLayout(LayoutKind.Sequential)]
        struct HARDWAREINPUT
        {
            public uint uMsg;
            public ushort wParamL;
            public ushort wParamH;
        }

        const uint INPUT_KEYBOARD = 1;
        const uint KEYEVENTF_KEYUP = 0x0002;
        const uint KEYEVENTF_UNICODE = 0x0004;
        const ushort VK_RETURN = 0x0D;
        const ushort VK_TAB = 0x09;

        static volatile bool isPaused = false;
        static volatile bool isStopped = false;
        static Thread typingThread = null;
        static readonly object syncRoot = new object();
        static readonly Random random = new Random();

        static void SendChar(char c)
        {
            if (c == '\r') return; // Ignore carriage return if string has \r\n, \n will hit enter

            if (c == '\n')
            {
                INPUT[] enterInputs = new INPUT[2];
                enterInputs[0].type = INPUT_KEYBOARD;
                enterInputs[0].u.ki.wVk = VK_RETURN;
                enterInputs[0].u.ki.dwFlags = 0;

                enterInputs[1].type = INPUT_KEYBOARD;
                enterInputs[1].u.ki.wVk = VK_RETURN;
                enterInputs[1].u.ki.dwFlags = KEYEVENTF_KEYUP;

                SendInput(2, enterInputs, Marshal.SizeOf(typeof(INPUT)));
                return;
            }

            if (c == '\t')
            {
                INPUT[] tabInputs = new INPUT[2];
                tabInputs[0].type = INPUT_KEYBOARD;
                tabInputs[0].u.ki.wVk = VK_TAB;
                tabInputs[0].u.ki.dwFlags = 0;

                tabInputs[1].type = INPUT_KEYBOARD;
                tabInputs[1].u.ki.wVk = VK_TAB;
                tabInputs[1].u.ki.dwFlags = KEYEVENTF_KEYUP;

                SendInput(2, tabInputs, Marshal.SizeOf(typeof(INPUT)));
                return;
            }

            INPUT[] unicodeInputs = new INPUT[2];
            unicodeInputs[0].type = INPUT_KEYBOARD;
            unicodeInputs[0].u.ki.wScan = (ushort)c;
            unicodeInputs[0].u.ki.dwFlags = KEYEVENTF_UNICODE;

            unicodeInputs[1].type = INPUT_KEYBOARD;
            unicodeInputs[1].u.ki.wScan = (ushort)c;
            unicodeInputs[1].u.ki.dwFlags = KEYEVENTF_UNICODE | KEYEVENTF_KEYUP;

            SendInput(2, unicodeInputs, Marshal.SizeOf(typeof(INPUT)));
        }

        static void TypeWorker(string text, int delayMs, int variancePercent)
        {
            try
            {
                int total = text.Length;
                Console.WriteLine("START {0}", total);

                for (int i = 0; i < total; i++)
                {
                    while (isPaused && !isStopped)
                    {
                        Thread.Sleep(50);
                    }

                    if (isStopped)
                    {
                        Console.WriteLine("STOPPED {0}", i);
                        return;
                    }

                    char c = text[i];
                    SendChar(c);

                    Console.WriteLine("PROGRESS {0} {1} {2}", i + 1, total, (int)c);

                    int waitTime = delayMs;
                    if (variancePercent > 0 && delayMs > 10)
                    {
                        int delta = (delayMs * variancePercent) / 100;
                        waitTime += random.Next(-delta, delta + 1);
                        if (waitTime < 10) waitTime = 10;
                    }

                    // Sleep in small increments to allow rapid emergency stop
                    int slept = 0;
                    while (slept < waitTime)
                    {
                        if (isStopped)
                        {
                            Console.WriteLine("STOPPED {0}", i + 1);
                            return;
                        }
                        int chunk = Math.Min(20, waitTime - slept);
                        Thread.Sleep(chunk);
                        slept += chunk;
                    }
                }

                if (!isStopped)
                {
                    Console.WriteLine("DONE {0}", total);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR {0}", ex.Message.Replace("\r", " ").Replace("\n", " "));
            }
        }

        static string GetActiveWindowTitle()
        {
            IntPtr handle = GetForegroundWindow();
            StringBuilder title = new StringBuilder(256);
            if (GetWindowText(handle, title, 256) > 0)
            {
                return title.ToString();
            }
            return "Unknown Window";
        }

        static void Main(string[] args)
        {
            Console.OutputEncoding = Encoding.UTF8;
            Console.WriteLine("READY SmartAutoTyperCore v1.0");

            string line;
            while ((line = Console.ReadLine()) != null)
            {
                string cmd = line.Trim();
                if (string.IsNullOrEmpty(cmd)) continue;

                if (cmd.StartsWith("START_BASE64 "))
                {
                    // Format: START_BASE64 <base64Text> <delayMs> <variancePercent>
                    try
                    {
                        string[] parts = cmd.Split(' ');
                        string base64 = parts[1];
                        int delayMs = int.Parse(parts[2]);
                        int variance = parts.Length > 3 ? int.Parse(parts[3]) : 0;

                        byte[] bytes = Convert.FromBase64String(base64);
                        string text = Encoding.UTF8.GetString(bytes);

                        lock (syncRoot)
                        {
                            isStopped = true;
                            if (typingThread != null && typingThread.IsAlive)
                            {
                                typingThread.Join(500);
                            }

                            isStopped = false;
                            isPaused = false;
                            typingThread = new Thread(() => TypeWorker(text, delayMs, variance));
                            typingThread.IsBackground = true;
                            typingThread.Start();
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("ERROR Failed to start: {0}", ex.Message);
                    }
                }
                else if (cmd == "PAUSE")
                {
                    isPaused = true;
                    Console.WriteLine("PAUSED");
                }
                else if (cmd == "RESUME")
                {
                    isPaused = false;
                    Console.WriteLine("RESUMED");
                }
                else if (cmd == "STOP")
                {
                    isStopped = true;
                    isPaused = false;
                    Console.WriteLine("STOP_ACK");
                }
                else if (cmd == "WINDOW_TITLE")
                {
                    Console.WriteLine("WINDOW {0}", GetActiveWindowTitle());
                }
                else if (cmd == "PING")
                {
                    Console.WriteLine("PONG");
                }
                else if (cmd == "EXIT")
                {
                    isStopped = true;
                    break;
                }
            }
        }
    }
}
