param()

Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;

public class NativeInput {
    [StructLayout(LayoutKind.Sequential)]
    public struct INPUT {
        public uint type;
        public InputUnion u;
    }

    [StructLayout(LayoutKind.Explicit)]
    public struct InputUnion {
        [FieldOffset(0)] public MOUSEINPUT mi;
        [FieldOffset(0)] public KEYBDINPUT ki;
        [FieldOffset(0)] public HARDWAREINPUT hi;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct KEYBDINPUT {
        public ushort wVk;
        public ushort wScan;
        public uint dwFlags;
        public uint time;
        public IntPtr dwExtraInfo;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct MOUSEINPUT {
        public int dx;
        public int dy;
        public uint mouseData;
        public uint dwFlags;
        public uint time;
        public IntPtr dwExtraInfo;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct HARDWAREINPUT {
        public uint uMsg;
        public ushort wParamL;
        public ushort wParamH;
    }

    [DllImport("user32.dll", SetLastError = true)]
    public static extern uint SendInput(uint nInputs, [MarshalAs(UnmanagedType.LPArray), In] INPUT[] pInputs, int cbSize);

    [DllImport("user32.dll")]
    public static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
    public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder lpString, int nMaxCount);

    public const uint INPUT_KEYBOARD = 1;
    public const uint KEYEVENTF_KEYUP = 0x0002;
    public const uint KEYEVENTF_UNICODE = 0x0004;
    public const ushort VK_RETURN = 0x0D;
    public const ushort VK_TAB = 0x09;

    public static string GetActiveTitle() {
        IntPtr hwnd = GetForegroundWindow();
        System.Text.StringBuilder sb = new System.Text.StringBuilder(256);
        if (GetWindowText(hwnd, sb, 256) > 0) {
            return sb.ToString();
        }
        return "Unknown";
    }

    public static uint SendChar(char c) {
        if (c == '\r') return 1;

        if (c == '\n') {
            INPUT[] enter = new INPUT[2];
            enter[0].type = INPUT_KEYBOARD;
            enter[0].u.ki.wVk = VK_RETURN;
            enter[0].u.ki.dwFlags = 0;

            enter[1].type = INPUT_KEYBOARD;
            enter[1].u.ki.wVk = VK_RETURN;
            enter[1].u.ki.dwFlags = KEYEVENTF_KEYUP;

            return SendInput(2, enter, Marshal.SizeOf(typeof(INPUT)));
        }

        if (c == '\t') {
            INPUT[] tab = new INPUT[2];
            tab[0].type = INPUT_KEYBOARD;
            tab[0].u.ki.wVk = VK_TAB;
            tab[0].u.ki.dwFlags = 0;

            tab[1].type = INPUT_KEYBOARD;
            tab[1].u.ki.wVk = VK_TAB;
            tab[1].u.ki.dwFlags = KEYEVENTF_KEYUP;

            return SendInput(2, tab, Marshal.SizeOf(typeof(INPUT)));
        }

        INPUT[] unicode = new INPUT[2];
        unicode[0].type = INPUT_KEYBOARD;
        unicode[0].u.ki.wScan = (ushort)c;
        unicode[0].u.ki.dwFlags = KEYEVENTF_UNICODE;

        unicode[1].type = INPUT_KEYBOARD;
        unicode[1].u.ki.wScan = (ushort)c;
        unicode[1].u.ki.dwFlags = KEYEVENTF_UNICODE | KEYEVENTF_KEYUP;

        return SendInput(2, unicode, Marshal.SizeOf(typeof(INPUT)));
    }
}
'@

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::WriteLine("READY NativePowerShellTyper")

while ($true) {
    $line = [Console]::ReadLine()
    if ($null -eq $line) { break }
    $cmd = $line.Trim()
    if ([string]::IsNullOrEmpty($cmd)) { continue }

    if ($cmd.StartsWith("TYPE_CHAR ")) {
        $charCode = [int]($cmd.Substring(10).Trim())
        $c = [char]$charCode
        $ret = [NativeInput]::SendChar($c)
        [Console]::WriteLine("ACK $charCode $ret")
    }
    elseif ($cmd -eq "WINDOW_TITLE") {
        $title = [NativeInput]::GetActiveTitle()
        [Console]::WriteLine("WINDOW $title")
    }
    elseif ($cmd -eq "PING") {
        [Console]::WriteLine("PONG")
    }
    elseif ($cmd -eq "EXIT") {
        break
    }
}
