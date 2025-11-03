# How to Use - Step-by-Step Instructions

## **OPTION 1: Double-Click Method (EASIEST - No Terminal!)**

### Step 1: Start the App
1. Navigate to folder:
   ```
   /Users/ivanvalenciaperez/Downloads/CLAUDE/PROMPT_ENGENERING/design-prompt-app
   ```

2. Find the file: **`START_APP.command`**

3. **Double-click it!**
   - A terminal window will open
   - You'll see ASCII art: "🎨 Design Prompt Generator - RUNNING! 🎨"
   - Keep this terminal window OPEN while using the app

4. **First time only (Mac security):**
   - If macOS blocks it, right-click → "Open" → Click "Open" again in dialog
   - You only need to do this once!

### Step 2: Open in Browser
1. Open your web browser (Chrome, Safari, Firefox, etc.)

2. Go to:
   ```
   http://localhost:3001
   ```

3. **Bookmark this page** for easy access!

### Step 3: Use the App
See "How to Use the Interface" section below

### Step 4: Stop the App (When Done)
1. Find the file: **`STOP_APP.command`**

2. **Double-click it!**
   - The terminal window will close
   - The app will stop

---

## **OPTION 2: Terminal Method (For Advanced Users)**

### Step 1: Open Terminal
- **Mac:** Applications → Utilities → Terminal
- **Windows:** Search for "Command Prompt" or "PowerShell"

### Step 2: Navigate to App Directory
```bash
cd "/Users/ivanvalenciaperez/Downloads/CLAUDE/PROMPT_ENGENERING/design-prompt-app"
```

### Step 3: Start the Server
```bash
npm start
```

**You'll see:**
```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║        🎨 Design Prompt Generator - RUNNING! 🎨           ║
║                                                            ║
║        Open your browser and go to:                        ║
║                                                            ║
║        👉  http://localhost:3001                          ║
║                                                            ║
║        ⚡ Now powered by Claude Code!                      ║
║        📚 Reads your project documentation automatically   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

✅ Server ready! Waiting for requests...
```

**Keep this terminal window OPEN!** Don't close it while using the app.

### Step 4: Open in Browser
Open your browser and go to: **http://localhost:3001**

### Step 5: Stop the Server (When Done)
In the terminal window, press: **`Ctrl + C`** (or `Cmd + C` on Mac)

---

## **How to Use the Interface**

### Step 1: Select Your Project Type

You'll see 4 colorful cards at the top:

**1. 🎨 Generate Variations from an Existing Design** (Blue)
- Use when: You have an existing design and want variations
- Example: "Create a tiger variation swimming in water"
- Output: 150-300 word variation prompt with transformation details

**2. ✨ Design from Scratch** (Purple)
- Use when: Creating a brand new design
- Example: "Create design for Hermosillo with desert theme"
- Output: 200-350 word complete design prompt

**3. 🔄 Design Based on a Previous Element** (Green)
- Use when: Using a previous design element in a new design
- Example: "Use the cactus character in a new Guadalajara design"
- Output: 200-350 word design prompt with composition frameworks

**4. 🔧 Modify Existing Design** (Red)
- Use when: Making specific changes to an existing design
- Example: "Change the character's dress to traditional clothing"
- Output: 150-200 word modification prompt with → transformation notation

**Click on one to select it.** It will highlight/glow.

---

### Step 2: Fill in Your Instruction

In the big text box labeled **"What do you want to create?"**, type your instruction.

**Examples:**

For **Generate Variations:**
```
Create a variation with the Ángel swimming in tropical water surrounded by colorful fish
```

For **Design from Scratch:**
```
Create a souvenir design for Hermosillo featuring a saguaro cactus character in the desert
```

For **Previous Element:**
```
Create design using the mushroom house for Cancún beach theme
```

For **Modify Design:**
```
Change the character's outfit to beach vacation clothes
```

---

### Step 3: Fill Optional Fields (Recommended!)

These help Claude Code generate better prompts:

**Destination** (optional but helpful):
```
Example: "Hermosillo", "CDMX", "Oaxaca", "Cancún"
```

**Theme** (optional):
```
Example: "Christmas", "Summer", "Day of the Dead", "Beach"
```

**Transformeter Level** (only for Variations, 1-10):
- 1-3: Minor changes (same pose, small tweaks)
- 4-6: Moderate changes (different setting, new elements)
- 7-10: Major transformation (completely different narrative)

**Decoration Level** (1-10):
- 6/10: Moderate, clean, breathing room
- 8/10: Abundant, richly filled
- 10/10: Maximal, every space filled

---

### Step 4: Upload Images (Optional)

**Two ways to add images:**

**Method 1: Click to Upload**
1. Click the upload box
2. Select image(s) from your computer
3. Can select multiple images at once

**Method 2: Paste Images (Cmd+V / Ctrl+V)**
1. Copy an image (from anywhere)
2. Click in the upload area
3. Press `Cmd+V` (Mac) or `Ctrl+V` (Windows)
4. Image appears instantly!

**To remove an image:**
- Click the "Remove" button on any image thumbnail

---

### Step 5: Set Number of Variations (Optional)

Use the **"How many variations?"** slider:
- Default: 1 variation
- Max: 10 variations

**Time estimate:**
- 1 variation: 30-50 seconds
- 3 variations: 90-150 seconds
- 5 variations: 150-250 seconds

**Note:** Each variation uses a different approach/style automatically

---

### Step 6: Generate!

Click the big **"✨ Generate Prompt"** button.

**What happens:**
1. Loading icon appears
2. Server opens Claude Code in the background
3. Claude Code reads all project documentation
4. Makes API call to Anthropic
5. Generates intelligent prompt(s)
6. Returns to browser (30-50 seconds typically)

**While waiting:**
- Loading spinner shows it's working
- **Be patient!** 30-50 seconds is normal
- Check terminal/console if you want to see progress
- At 20 seconds, you'll see a progress message in console

---

### Step 7: View & Copy Your Prompt(s)

**When generation completes:**

You'll see one or more **variation cards** with:
- **Title** (e.g., "Variation 1")
- **Full generated prompt** (150-350 words)
- **Copy button** - Click to copy to clipboard!

**Each variation card has:**
- ✅ **Copy to Clipboard** button
- Formatted prompt text ready to use

**To use the prompt:**
1. Click "Copy to Clipboard"
2. Go to your AI image generator (Gemini, DALL-E, Midjourney, etc.)
3. Paste the prompt
4. Generate your design!

---

### Step 8: Generate More (Optional)

Want different variations?

**Click "Generate Another"** to:
- Keep same settings
- Generate a fresh variation
- Try different composition/style approach

**Or:**
- Change your instruction
- Adjust settings
- Click "Generate Prompt" again

---

## **What to Expect - Timing**

### Normal Generation Times:

| Project | Typical Time | Notes |
|---------|--------------|-------|
| Modify Design | 25-35 seconds | Fastest (least documentation) |
| Design from Scratch | 30-40 seconds | Moderate |
| Previous Element | 35-45 seconds | More docs to read |
| Generate Variations | 40-50 seconds | Slowest (most documentation) |

**Multiple Variations:**
- Add 20-30 seconds per additional variation
- 5 variations = 150-250 seconds total

**First Request:**
- Always slower (initialization)
- Subsequent requests faster

---

## **Troubleshooting**

### Problem: "Timeout after 45 seconds"

**Causes:**
- Slow internet connection
- Large documentation files
- First request (initialization)
- Complex instruction

**Solutions:**
1. ✅ Check your internet connection
2. ✅ Simplify your instruction (shorter = faster)
3. ✅ Try again (sometimes transient)
4. ✅ Generate 1 variation instead of many
5. ✅ Restart the app

---

### Problem: "No output received"

**Causes:**
- Claude Code not installed
- Not logged into Claude Code
- Network issue

**Solutions:**
1. ✅ Check Claude Code installed: `claude --version` in terminal
2. ✅ Login if needed: `claude login` in terminal
3. ✅ Restart the app completely
4. ✅ Check internet connection

---

### Problem: Page won't load (localhost:3001)

**Causes:**
- Server not running
- Wrong port

**Solutions:**
1. ✅ Check terminal shows "Server ready!" message
2. ✅ Try: http://localhost:3001 (check spelling)
3. ✅ Restart the server

---

### Problem: Multiple terminal windows open

**Cause:**
- Started the app multiple times

**Solution:**
1. ✅ Close all terminal windows
2. ✅ Double-click `STOP_APP.command`
3. ✅ Wait 5 seconds
4. ✅ Double-click `START_APP.command` ONCE

---

## **Tips for Best Results**

### Writing Good Instructions:

**✅ DO:**
- Be specific: "Swimming in tropical water with colorful fish"
- Use action verbs: "jumping", "swimming", "holding", "celebrating"
- Include context: destination, theme, mood
- Keep it concise: 1-3 sentences

**❌ DON'T:**
- Be vague: "Make it different"
- Write essays: Long paragraphs slow processing
- Use technical jargon: Keep it creative, not technical

---

### Choosing the Right Project:

**Use "Generate Variations" when:**
- You have an existing design
- You want to keep the same character/element
- You want different poses/settings/decorations

**Use "Design from Scratch" when:**
- Creating completely new design
- New destination or theme
- No existing element to base on

**Use "Previous Element" when:**
- Reusing a character/landmark/object
- Applying to different destination
- Need composition frameworks

**Use "Modify Design" when:**
- Changing specific elements (clothing, pose, background)
- Keeping everything else the same
- Need precise transformations

---

## **Example Workflows**

### Example 1: Create New Design

**Goal:** Design for Hermosillo with desert theme

**Steps:**
1. Select: ✨ **Design from Scratch**
2. Instruction: "Create design for Hermosillo with friendly saguaro cactus character"
3. Destination: "Hermosillo"
4. Theme: "Desert"
5. Decoration Level: 8/10
6. Click "Generate Prompt"
7. Wait 30-40 seconds
8. Copy prompt, paste into Gemini/DALL-E
9. Generate image!

---

### Example 2: Modify Existing Design

**Goal:** Change character's outfit to beach clothes

**Steps:**
1. Select: 🔧 **Modify Existing Design**
2. Instruction: "Change the character's outfit to tropical beach vacation clothes"
3. Upload: Original design image
4. Click "Generate Prompt"
5. Wait 25-35 seconds
6. Copy modification prompt
7. Use with image editor or AI modifier
8. Done!

---

### Example 3: Generate Multiple Variations

**Goal:** 3 different tiger variations

**Steps:**
1. Select: 🎨 **Generate Variations**
2. Instruction: "Create tiger variation swimming in water"
3. Theme: "Ocean"
4. Transformeter Level: 7/10
5. Decoration Level: 8/10
6. Variations: 3
7. Click "Generate Prompt"
8. Wait 90-150 seconds (3 × 30-50s)
9. Get 3 different variations!
10. Copy each one individually
11. Generate 3 different images

---

## **Quick Reference**

### Starting the App:
```
Double-click: START_APP.command
Open browser: http://localhost:3001
```

### Using the App:
```
1. Select project type (click card)
2. Type instruction
3. Fill optional fields
4. Upload images (optional)
5. Set variation count
6. Click "Generate Prompt"
7. Wait 30-50 seconds
8. Copy prompt
```

### Stopping the App:
```
Double-click: STOP_APP.command
OR
Terminal: Ctrl+C / Cmd+C
```

---

## **Support**

**If you need help:**
1. Read PERFORMANCE_NOTES.md for timing/timeout issues
2. Read README.md for technical details
3. Check HOW_TO_USE.html for visual guide
4. Look at terminal console for error messages

**Common files:**
- `START_APP.command` - Start the app (double-click)
- `STOP_APP.command` - Stop the app (double-click)
- `README.md` - Technical documentation
- `HOW_TO_USE.html` - Visual guide (open in browser)
- `PERFORMANCE_NOTES.md` - Performance explanation
- `HOW_TO_USE_STEP_BY_STEP.md` - This file!

---

**Enjoy creating amazing design prompts!** 🎨✨

**Remember:** 30-50 seconds per generation is NORMAL. Be patient and the results will be worth it!
