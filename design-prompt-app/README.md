# Design Prompt Generator App

A beautiful, user-friendly web application that makes generating design prompts easy and accessible - no terminal experience needed!

## Features

- 🎨 **Beautiful Interface** - Clean, modern design that's easy to use
- 🔄 **Multi-Project Support** - Works with all your design workflows:
  - Generate Variations from an Existing Design
  - Design from Scratch
  - Design Based on a Previous Element
  - Modify Existing Design
- 📷 **Image Upload** - Attach reference images to your prompts
- 📋 **One-Click Copy** - Copy generated prompts instantly to clipboard
- ⚡ **Smart Generation** - Automatically uses the right formula for each project type
- 🔄 **Generate Variations** - Try different prompt variations with one click

## Quick Start

### EASIEST WAY (No Terminal!) 🎉

**Already set up for you!** Just double-click these files:

1. **START_APP.command** - Starts the app
2. Open browser → **http://localhost:3001**
3. When done, double-click **STOP_APP.command** - Stops the app

**First time only:** If macOS asks for permission, right-click the file → Open → click "Open" in the dialog.

**Visual Guide:** Open **HOW_TO_USE.html** in your browser for step-by-step instructions!

---

### Alternative: Terminal Method

### 1. Install Node.js (One-Time Setup)

If you don't have Node.js installed:
- Visit https://nodejs.org
- Download and install the LTS (Long Term Support) version
- This is a one-time setup!

### 2. Install Dependencies

Open Terminal (or Command Prompt on Windows) and run:

```bash
cd "/Users/ivanvalenciaperez/Desktop/CLAUDE/READY/PROMPT_ENGENERING/design-prompt-app"
npm install
```

This installs the required packages (only need to do this once).

### 3. Start the App

```bash
npm start
```

You'll see a beautiful ASCII art message telling you the app is running!

### 4. Open in Browser

Open your web browser and go to:
```
http://localhost:3001
```

That's it! The app is now running. 🎉

## How to Use

### Step 1: Select Your Project
Click on one of the four project cards at the top:
- **Generate Variations** - For creating variations of existing designs
- **Design from Scratch** - For creating brand new designs
- **Previous Element** - For designs based on existing elements
- **Modify Design** - For modifying specific aspects of designs

### Step 2: Describe What You Want
In the big text box, describe what you want to create or modify. Examples:
- "Create a variation with the Ángel swimming in water surrounded by tropical fish"
- "Change the character's outfit to traditional Mexican clothing"
- "Add Christmas decorations around the main element"

### Step 3: Fill Optional Fields (Helps AI Generate Better Prompts)
- **Destination**: Where is this design for? (e.g., "Hermosillo", "CDMX")
- **Theme**: Any specific theme? (e.g., "Christmas", "Summer", "Dia de Muertos")
- **Transformeter Level**: (Only for Variations) How much to change (1-10)
  - 1-3: Minor adjustments
  - 4-6: Moderate changes
  - 7-10: Major transformation
- **Decoration Level**: How much decorative detail (1-10)

### Step 4: Upload Images (Optional)
Click the upload area to attach reference images if needed.

### Step 5: Generate!
Click **"Generate Prompt"** and watch the magic happen! ✨

Your prompt will appear below, ready to copy.

### Step 6: Copy & Use
Click **"Copy to Clipboard"** and paste the prompt into your AI image generator (Gemini, DALL-E, Midjourney, etc.)

Want a different variation? Click **"Generate Another"** to try a different approach!

## Behind the Scenes (Technical Details)

The app runs a local web server on your computer:
- **Backend**: Node.js + Express (handles prompt generation logic)
- **Frontend**: Clean HTML/CSS/JavaScript (the beautiful interface you see)
- **No Internet Required**: Runs entirely on your computer
- **Privacy**: Your data stays on your machine

## Stopping the App

When you're done:
1. Go back to the Terminal window
2. Press `Ctrl + C` (or `Cmd + C` on Mac)
3. The app will stop

## Tips & Tricks

### For Best Results:
1. **Be Specific** - The more detail you provide, the better the prompt
2. **Use Keywords** - Words like "swimming", "flying", "holding" trigger smart suggestions
3. **Reference Destinations** - Including location names pulls in regional elements
4. **Adjust Levels** - Play with Transformeter and Decoration levels for different results

### Making It Even Easier:
You can create a shortcut:
1. Create a text file called `start.command` (Mac) or `start.bat` (Windows)
2. Add these lines:
   ```bash
   cd "/Users/ivanvalenciaperez/Desktop/CLAUDE/READY/PROMPT_ENGENERING/design-prompt-app"
   npm start
   ```
3. Double-click the file to start the app instantly!

## Project Structure

```
design-prompt-app/
├── server.js           # Backend server (prompt generation logic)
├── package.json        # Dependencies and scripts
├── public/
│   └── index.html     # Frontend interface (what you see in browser)
├── uploads/           # Temporary storage for uploaded images
└── README.md          # This file!
```

## Troubleshooting

**Port already in use?**
If you see "Port 3000 already in use", either:
- Stop other apps using port 3000, or
- Edit `server.js` and change `PORT = 3000` to another number like `3001`

**npm command not found?**
You need to install Node.js first (see Quick Start step 1).

**App won't start?**
Make sure you ran `npm install` first to install dependencies.

## Customization

Want to change the colors or add features? The code is clean and well-commented:
- Edit `public/index.html` to change the interface
- Edit `server.js` to modify prompt generation logic

## What's Next?

Future improvements could include:
- Saving favorite prompts
- History of generated prompts
- Preset templates for common requests
- Dark mode toggle
- Export prompts as files

---

**Enjoy creating amazing designs!** 🎨✨

If you have questions or suggestions, feel free to modify the app - it's yours!
