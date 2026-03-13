# AXKAN Design Prompt Generator

A web application that generates AI image prompts for AXKAN souvenir products (magnets, bottle openers, stickers, etc.) using Claude Code as the AI backbone. Supports batch generation, key-based permutations, Gemini/Envato integration, and style reference analysis.

## Prerequisites

Before cloning, ensure the following are installed on the target machine:

### 1. Node.js (v18+ required, v22 recommended)

```bash
# macOS (Homebrew)
brew install node

# Or download from https://nodejs.org (LTS version)

# Verify
node -v   # should be v18+
npm -v    # should be v9+
```

### 2. Claude Code CLI

The app spawns `claude` CLI processes to generate prompts. This is the core AI engine.

```bash
# Install globally
npm install -g @anthropic/claude-code

# Verify
claude --version

# First-time: authenticate
claude
# Follow the prompts to log in with your Anthropic account
```

**Important:** The `claude` command must be available in `PATH`. If installed via npm global, it should be automatic. If not, add the npm global bin to your shell profile:

```bash
# Find where npm globals are installed
npm config get prefix

# Add to ~/.zshrc or ~/.bashrc
export PATH="$(npm config get prefix)/bin:$PATH"
```

### 3. Anthropic API Access

Claude Code requires an active Anthropic account with API access. The CLI handles authentication — no API key environment variables needed.

## Installation

### Clone the repository

```bash
git clone <your-repo-url>
cd PROMPT_ENGENERING
```

### Install Node.js dependencies

```bash
cd design-prompt-app
npm install
```

This installs:
- `express` (v4.18+) — web server
- `multer` (v1.4+) — file upload handling

### Verify project documentation folders exist

The app reads design documentation from sibling folders. These must exist at the repository root:

```
PROMPT_ENGENERING/
├── Generate Variations from an Existing Design/   # variation docs + examples
├── Design from Scratch/                            # from-scratch docs
├── Design Based on a Previous Element/             # previous-element docs
├── MODIFY_DESIGN/                                  # modify docs
├── AXKAN/                                          # brand assets
├── PRODUCT_TYPE/                                   # product type specs
└── design-prompt-app/                              # this app
```

These folders contain `.md` files that Claude reads to understand the design system, brand guidelines, product constraints, and prompt patterns. Without them, prompts will be generic.

## Running the App

### Start the server

```bash
cd design-prompt-app
npm start
```

Or directly:

```bash
node server.js
```

The server starts on **http://localhost:3001**.

### macOS Quick Start (double-click)

Pre-made scripts are included:

- **`START_APP.command`** — double-click to start the server
- **`STOP_APP.command`** — double-click to stop
- **`REBOOT_APP.command`** — double-click to restart

First time on macOS: right-click the `.command` file, select Open, then click "Open" in the security dialog.

### Verify it works

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001
# Should output: 200
```

Open **http://localhost:3001** in your browser.

## How It Works

### Architecture

```
Browser (index.html)
    |
    | POST /api/generate-prompt-stream (SSE)
    v
Express Server (server.js)
    |
    | spawn('claude', [...args])
    v
Claude Code CLI
    |
    | Reads project documentation (.md files)
    | Analyzes uploaded reference images
    | Generates design prompts
    v
Streaming response back to browser
```

### Generation Modes

| Mode | Speed | How |
|------|-------|-----|
| **Normal** | ~30-60s per prompt | Claude reads full project documentation |
| **Turbo** | ~10-20s per prompt | Skips docs, uses inline system prompt |
| **Parallel** | All at once | Multiple variations launch simultaneously |

### Key Features

#### Project Types
- **Design Variation** — Create variations of an existing design (reference image required)
- **New Design** — Design from scratch with full creative freedom
- **Previous Element** — Build on a specific existing element
- **Modify Design** — Make specific changes to an existing design

#### Keys (Variables/Permutations)
Define named variables that auto-substitute into instructions:

1. Click **+ Add Key** in the form
2. Name the key (e.g., `ANIMALS`)
3. Add comma-separated values (e.g., `snake, turtle, capybara`)
4. **Green dot** = permutation mode (one prompt per value)
5. **Red dot** = single mode (all values as one string)

The system computes the cartesian product. Example:
- `ANIMALS = snake, turtle, capybara` (3 values, permute ON)
- Variations slider = 2
- Result: **6 prompts** (3 animals x 2 variations each)

Key names are matched **case-insensitively** in the instructions. If you type `animals` and have an `ANIMALS` key, it highlights pink and gets replaced.

#### Send to Gemini
Copies the generated prompt to clipboard and opens a new Google Gemini tab. If reference images are uploaded, they're included.

#### Send to Envato
Automates pasting prompts into Envato ImageGen via AppleScript (macOS only). Supports bulk send for all variations.

#### Style Reference
Upload a reference image for style analysis. Claude describes the visual style and incorporates it into the generated prompt. This image is **not** sent to Gemini/Envato — it's only for Claude's analysis.

#### Default Keys
The **DESTINATION** key appears by default and cannot be deleted. Enter comma-separated destinations (e.g., `Cancún, CDMX, Hermosillo`). With permutation ON (green dot), each destination generates its own prompt.

## macOS Setup (Required for Gemini/Envato Automation)

The "Send to Gemini" and "Send to Envato" buttons use **AppleScript** to control Google Chrome. This requires manual permission setup on each new machine.

### 1. Install Google Chrome

The automation targets Chrome specifically. Safari or Firefox will not work for the send features.

### 2. Grant Accessibility Permissions

AppleScript needs permission to control Chrome's UI (clicking, typing, opening tabs).

1. Open **System Settings** → **Privacy & Security** → **Accessibility**
2. Click the **+** button and add **Terminal** (or **iTerm** if you use that)
3. If you run the app via the `.command` scripts, also add **Terminal** there
4. You may also need to add **Google Chrome** itself

> First time you click "Send to Gemini" or "Send to Envato", macOS will pop up a dialog asking to allow control. **Click "OK"/"Allow"**. If you accidentally click "Don't Allow", go to System Settings and enable it manually.

### 3. Grant Automation Permissions

1. Open **System Settings** → **Privacy & Security** → **Automation**
2. Ensure **Terminal** (or your terminal app) has permission to control **Google Chrome**
3. This usually gets prompted automatically on first use — click **OK**

### 4. Allow JavaScript Execution in Chrome (for Envato)

Envato automation uses `execute javascript` in Chrome tabs via AppleScript. This requires:

1. Open Chrome → **View** → **Developer** → **Allow JavaScript from Apple Events**
2. Or from Terminal:
```bash
defaults write com.google.Chrome AppleEnableJavaScriptFromAppleEvents -bool true
```
3. **Restart Chrome** after enabling this

> Without this setting, the Envato send will fail silently — prompts won't paste into the text field.

### 5. Python 3 with PyObjC (for Gemini image clipboard)

The "Send to Gemini" feature copies reference images to the clipboard using Python's `AppKit` (PyObjC). macOS includes Python 3, but PyObjC may need to be installed:

```bash
# Check if it works
python3 -c "from AppKit import NSPasteboard; print('OK')"

# If that fails, install PyObjC
pip3 install pyobjc-framework-Cocoa
```

## Workflow: How to Use the App

### Basic Workflow (Prompt Generation Only)

1. Open `http://localhost:3001` in your browser
2. Select a **project type** (Design Variation, New Design, etc.)
3. Fill in the **DESTINATION** key values (e.g., `Cancún`)
4. Write **instructions** describing what you want
5. Upload **reference images** if needed (drag & drop or paste from clipboard)
6. Choose **product type**, **style**, **ratio**
7. Set **variation count** (how many prompts to generate)
8. Click **Generate** — prompts appear as they complete

### Copy-Paste Workflow (Manual)

1. Generate your prompts
2. Click the **copy button** on any prompt card to copy it to clipboard
3. Open [Google Gemini](https://gemini.google.com/) or any AI image tool
4. Paste the prompt and upload your reference images manually
5. Generate the image

### Send to Gemini (Automated — macOS only)

1. Generate your prompts
2. Click **Send to Gemini** on a prompt card
3. The app automatically:
   - Copies the prompt text to clipboard
   - If you have reference images uploaded, copies each image to clipboard using Python
   - Opens a **new Chrome tab** with Google Gemini
   - Pastes the prompt into the Gemini text field
   - If images exist, pastes each image one by one (Cmd+V)
4. You just need to **click Generate** in Gemini
5. **Bulk send**: Click "Send All to Gemini" to repeat this for every generated prompt (each gets its own tab)

> **Note**: Each image is given a unique filename so Gemini doesn't reject duplicate uploads.

### Send to Envato (Automated — macOS only)

1. Generate your prompts
2. Click **Send to Envato** on a prompt card
3. The app automatically:
   - Opens a **new Chrome tab** with Envato ImageGen (`labs.envato.com/apps/image-gen`)
   - Waits for the page to load
   - Selects the correct **aspect ratio** (Square, Portrait, or Landscape based on your ratio setting)
   - Pastes the prompt into the text field
   - If reference images exist, uploads them via drag-and-drop simulation using a local server URL
   - Clicks the **Generate** button
4. **Bulk send**: Click "Send All to Envato" to open multiple tabs and fill each one — the app staggers them to avoid overloading

> **Important**: Don't switch away from Chrome while bulk send is running. AppleScript controls the active window.

### Reference Images vs Style Reference

| | Reference Images | Style Reference |
|--|-----------------|-----------------|
| **Purpose** | Shown to Gemini/Envato as visual input | Analyzed by Claude to describe the style |
| **Sent to Gemini/Envato?** | Yes | No |
| **Used in prompt text?** | No (sent as images) | Yes (style description embedded in prompt) |
| **Upload location** | Main image upload area | Separate "Style Reference" card |

### Using Keys for Batch Generation

**Example**: Generate magnet designs for 3 animals across 2 destinations:

1. **DESTINATION** key (default): `Cancún, Los Cabos` — green dot ON
2. Click **+ Add Key**, name it `ANIMALS`: `turtle, whale, parrot` — green dot ON
3. Instructions: `Create a fun souvenir magnet with ANIMALS and tropical vibes`
4. Variations: `1`
5. Result: **6 prompts** (3 animals × 2 destinations), each with the animal and destination substituted

The info banner shows the total count before you generate.

## Project Structure

```
design-prompt-app/
├── server.js              # Express server, Claude integration, API endpoints
├── package.json           # Dependencies (express, multer)
├── public/
│   ├── index.html         # Entire frontend (HTML + CSS + JS, single file)
│   └── fonts/
│       └── rl-aqva-black.otf  # AXKAN display font
├── uploads/               # Temp storage for uploaded images (auto-created)
├── tmp/                   # Temp dirs for Claude invocations (auto-created)
├── tmp-ref/               # CORS-served reference images for Envato (auto-created)
├── START_APP.command       # macOS double-click launcher
├── STOP_APP.command        # macOS double-click stopper
├── REBOOT_APP.command      # macOS double-click restarter
└── README.md              # This file
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Serves the frontend |
| `/api/generate-prompt-stream` | POST | SSE stream — generates prompts via Claude |
| `/api/send-to-gemini` | POST | Copies prompt + opens Gemini tab (macOS) |
| `/api/send-to-envato` | POST | Pastes prompt into Envato ImageGen (macOS) |
| `/api/send-all-to-gemini` | POST | Bulk send all prompts to Gemini |
| `/api/send-all-to-envato` | POST | Bulk send all prompts to Envato |
| `/api/analyze-instructions` | POST | AI-powered instruction enhancement |

## Configuration

### Port
Default is `3001`. Change in `server.js`:
```javascript
const PORT = 3001;
```

### Max Permutations
Default cap is 100 combinations. Change in `public/index.html`:
```javascript
const MAX_PERMUTATIONS = 100;
```

## Troubleshooting

### "claude: command not found"
The Claude Code CLI isn't in PATH. Reinstall or add to PATH:
```bash
npm install -g @anthropic/claude-code
# Or add npm global bin to PATH (see Prerequisites above)
```

### Prompts take too long
- Use **Turbo mode** (toggle in the UI) for faster generation
- Reduce variation count — each variation spawns a separate Claude process
- 10+ parallel processes will be slow; try 3-5 at a time
- First request is always slower (Claude loads documentation)

### "Port 3001 already in use"
```bash
# Kill whatever is using the port
lsof -ti:3001 | xargs kill -9
# Then restart
npm start
```

### Envato/Gemini buttons don't work
These use AppleScript to control Chrome — **macOS only**. They won't work on Windows/Linux. Checklist:
1. Is **Google Chrome** installed and set as the browser?
2. Did you grant **Accessibility** permission to Terminal? (System Settings → Privacy & Security → Accessibility)
3. Did you grant **Automation** permission? (System Settings → Privacy & Security → Automation → Terminal → Google Chrome)
4. Did you enable **JavaScript from Apple Events** in Chrome? (`defaults write com.google.Chrome AppleEnableJavaScriptFromAppleEvents -bool true` then restart Chrome)
5. Is Chrome the **frontmost app** when bulk sending? AppleScript controls the active window.

### Gemini images not pasting
The image clipboard uses Python's `AppKit` (PyObjC). If images don't paste:
```bash
# Test if PyObjC works
python3 -c "from AppKit import NSPasteboard; print('OK')"

# If it fails, install it
pip3 install pyobjc-framework-Cocoa
```

### Envato prompt not typing into the text field
Chrome must have "Allow JavaScript from Apple Events" enabled:
- Chrome menu → View → Developer → Allow JavaScript from Apple Events
- Or: `defaults write com.google.Chrome AppleEnableJavaScriptFromAppleEvents -bool true`
- Restart Chrome after enabling

### Images not uploading
Check that `uploads/` directory exists and is writable:
```bash
mkdir -p uploads tmp tmp-ref
```

### Keys not highlighting in instructions
- Key name must be typed in the key input (e.g., `ANIMALS`)
- The same word must appear in the instructions textarea
- Matching is case-insensitive: `animals`, `Animals`, `ANIMALS` all match

## Environment Notes

- **macOS**: Full support including Envato/Gemini automation
- **Windows/Linux**: Core prompt generation works. Gemini/Envato browser automation requires macOS (AppleScript)
- **Node.js**: v18 minimum, v22 recommended
- **Browser**: Any modern browser (Chrome, Firefox, Safari, Edge)
- **Disk**: ~50MB for dependencies + temporary files for image processing
