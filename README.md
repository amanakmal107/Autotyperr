# Smart AutoTyper — Modern Web & Desktop Typing Assistant

A professional, modern **Smart AutoTyper** application that enables users to enter text and automatically type it into an authorized target input field using simulated keyboard input.

Built with **React.js + Vite**, **Tailwind CSS**, and packaged with an **Electron Windows Desktop Companion**.

---

## 🌟 Key Features

### 1. Text Input Area & Editor
- **Large Text Editor**: Supports multiline text, paragraphs, numbers, and full special characters/symbols (`!@#$%^&*()_+`, Unicode, accents, tabs, and newlines).
- **Real-Time Telemetry**: Instant calculations for character count, word count, line count, and estimated typing completion time.
- **Import from `.TXT`**: Directly upload and parse plain text files into the editor.
- **Sample Presets**: Quick-load templates for Welcome text, JavaScript code snippets, structured form data, and Unicode/special characters.
- **Editor Controls**: One-click Copy, Clear Text, and Reset to default.

### 2. Automatic Simulated Typing
- **Character-by-Character Automation**: Accurately reproduces text character-by-character while preserving spaces, newlines, tabs, capitalization, and punctuation.
- **Dual Destination Modes**:
  1. **In-App Interactive Sandbox**: A built-in scratchpad for safe, instant testing right inside the application.
  2. **External Windows Desktop Application**: When running with Electron, sends native `SendInput` keystrokes to any active, focused external application window (Notepad, Word, Visual Studio Code, Excel, browser forms, etc.).
- **Live Controls**: Start, Pause, Resume, Stop, and Emergency Stop.

### 3. Adjustable Typing Speed & Humanization
- **Four Speed Presets**:
  - **Slow**: 2 characters/second (~24 WPM)
  - **Normal**: 5 characters/second (~60 WPM)
  - **Fast**: 10 characters/second (~120 WPM)
  - **Custom**: 1–30 characters/second (~12 to 360 WPM)
- **Interactive Slider**: Fine-grained slider allowing 1 to 30 characters per second.
- **Humanized Typing Variance**: Optional toggle adding &plusmn;25% natural delay jitter for realistic typing cadence.

### 4. Target Focus Countdown Timer
- **Configurable Delay (3–10 seconds)**: Quick pills (3s, 5s, 8s, 10s) and a fine slider.
- **High-Impact Countdown HUD**: Big animated countdown number with audio tick beeps, reminding you to switch focus to your intended target field before typing commences.
- **Cancel Anytime**: Hit `Esc` or click Cancel to immediately abort countdown.

### 5. Typing Progress & Real-Time Keystroke Visualizer
- **Telemetry Cards**: Total characters, characters completed, remaining characters, percentage progress bar, and estimated time remaining.
- **Live Keystroke Visualizer**: Displays typed characters in emerald, current character with a glowing blinking cursor, and pending characters dimmed. Auto-scrolls smoothly as typing progresses.

### 6. Keyboard Shortcuts & Emergency Stop
- **Default Shortcuts**:
  - <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>: Start Typing
  - <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>: Pause / Resume
  - <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd>: **Emergency Stop** (instantly terminates all keystrokes in under 10ms)
- **Configurable**: Rebind shortcuts via the in-app Shortcuts modal.

### 7. Audio Feedback & Sound Synthesizer
- Built using the **Web Audio API** with zero external audio assets.
- Includes crisp mechanical keyboard click sounds, countdown beep ticks, start chimes, and completion fanfare with confetti.

### 8. Safety & Compliance Guardrails
- **Explicit User Initiation**: Requires deliberate user interaction to begin typing.
- **Authorized Targets Only**: Designed exclusively for windows and fields you own or have permission to automate.
- **No Anti-Bot Bypass**: Complies with application boundaries and does not attempt to bypass CAPTCHAs or security gates.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + Vite 6 |
| **Styling** | Tailwind CSS v4 |
| **Desktop Companion** | Electron 34 (Windows 10 / Windows 11) |
| **Native Typing Core** | Windows API `SendInput` (`KEYEVENTF_UNICODE`) via PowerShell bridge |
| **Icons & Visuals** | Lucide React + Canvas Confetti |
| **State & Persistence** | React Hooks + LocalStorage API |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Windows 10 or Windows 11 (for external desktop typing integration)

### Running in Web Development Mode
Runs the React + Vite dashboard in your browser:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running with Electron Desktop Companion
Runs both the Vite server and Electron desktop window simultaneously with Windows global hotkeys and external window typing:
```bash
npm run electron:dev
```

### Production Build
Builds the optimized production assets in `dist/`:
```bash
npm run build
```

To run the built app in Electron:
```bash
npm run electron:start
```

---

## 📂 Project Directory Structure

```
Autotyper/
├── electron/
│   ├── main.cjs            # Electron main process (IPC, global shortcuts, window)
│   ├── preload.cjs         # Context isolation bridge for renderer
│   └── typer.ps1           # Windows native SendInput keystroke simulator
├── native/
│   └── AutoTyperCore.cs    # C# native SendInput source (reference)
├── src/
│   ├── components/
│   │   ├── ControlsBar.jsx      # Start, Pause, Resume, Emergency Stop
│   │   ├── CountdownConfig.jsx  # 3-10s delay countdown slider & pills
│   │   ├── CountdownModal.jsx   # Fullscreen countdown overlay HUD
│   │   ├── Header.jsx           # Top branding, audio toggles, HUD pin
│   │   ├── LiveVisualizer.jsx   # Real-time character visualizer & cursor
│   │   ├── ProgressSection.jsx  # Progress bar, metrics, status badges
│   │   ├── SafetyModal.jsx      # Ethical automation guidelines & policy
│   │   ├── ShortcutsModal.jsx   # Customizable keyboard shortcuts modal
│   │   ├── SpeedControls.jsx    # Slow, Normal, Fast, Custom (1-30 CPS), WPM
│   │   ├── TargetSelector.jsx   # In-app sandbox vs external desktop switch
│   │   ├── TextInputArea.jsx    # Source text editor, .txt import, stats
│   │   └── TestPlayground.jsx   # Interactive target testing sandbox
│   ├── hooks/
│   │   └── useTypingEngine.js   # Central state machine & timing controller
│   ├── utils/
│   │   ├── audio.js             # Web Audio API sound synthesizer
│   │   └── storage.js           # LocalStorage persistence & sample templates
│   ├── App.jsx                  # Main dashboard layout
│   ├── index.css                # Tailwind CSS v4 & custom animations
│   └── main.jsx                 # React root entry point
├── index.html                   # HTML entry point with fonts & meta
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite & Tailwind configuration
└── README.md                    # Documentation
```
