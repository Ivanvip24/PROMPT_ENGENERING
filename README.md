# AI Design Prompt Engineering System

A comprehensive prompt engineering system for generating AI-powered souvenir designs. Features a user-friendly web interface and multiple design workflows.

## Repository Structure

```
PROMPT_ENGENERING/
├── design-prompt-app/          # Web GUI application (MAIN APP)
├── Generate Variations from an Existing Design/
├── Design from Scratch/
├── Design Based on a Previous Element/
├── MODIFY_DESIGN/
└── CHANGE_RATIO/
```

## Quick Start

### For Users (Getting Started)

#### 1. First Time Setup

```bash
# Clone the repository
git clone https://github.com/Ivanvip24/PROMPT_ENGENERING.git
cd PROMPT_ENGENERING

# Install Node.js dependencies for the web app
cd design-prompt-app
npm install
```

**Prerequisites:**
- [Node.js](https://nodejs.org) (LTS version recommended)
- Git (for updates)

#### 2. Running the App

**Easy Way (Mac):**
```bash
# Just double-click this file:
design-prompt-app/START_APP.command
```

**Terminal Way (All platforms):**
```bash
cd design-prompt-app
npm start
```

Then open your browser to: **http://localhost:3001**

#### 3. Stopping the App

**Mac:** Double-click `design-prompt-app/STOP_APP.command`

**Terminal:** Press `Ctrl + C` (or `Cmd + C` on Mac)

---

## Getting Updates

When new features or improvements are available:

```bash
# Navigate to the project folder
cd /path/to/PROMPT_ENGENERING

# Get the latest updates
git pull

# Update dependencies (only if needed)
cd design-prompt-app
npm install
```

That's it! Your system is now updated.

---

## For Developers (Making Changes)

### Making Updates

After making changes to the code:

```bash
# Check what changed
git status

# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "Description of your changes"

# Push to GitHub
git push origin main
```

### Distributing Updates

Once you push to GitHub, others can get updates with:
```bash
git pull
```

No need to manually copy files, update paths, or redistribute!

---

## Features

### Web Application (`design-prompt-app/`)
- Beautiful GUI for generating design prompts
- Multi-project workflow support
- Image upload capabilities
- One-click prompt copying
- Smart variation generation

### Project Types
1. **Generate Variations** - Create variations of existing designs
2. **Design from Scratch** - Brand new design generation
3. **Previous Element** - Design based on existing elements
4. **Modify Design** - Targeted design modifications

---

## Documentation

Detailed documentation available in `design-prompt-app/`:
- `README.md` - App-specific documentation
- `HOW_TO_USE_STEP_BY_STEP.md` - Step-by-step guide
- `HOW_TO_USE.html` - Visual guide (open in browser)
- `DOCUMENTATION_MAP.md` - Complete documentation index

---

## System Requirements

- **Operating System:** macOS, Windows, or Linux
- **Node.js:** v14 or higher
- **RAM:** 512MB minimum
- **Disk Space:** ~100MB for dependencies

---

## Troubleshooting

### Port Already in Use
If you see "Port 3001 already in use":
```bash
# Find what's using the port (Mac/Linux)
lsof -i :3001

# Kill the process or change the port in server.js
```

### npm Command Not Found
Install [Node.js](https://nodejs.org) first.

### Git Pull Conflicts
If you have local changes conflicting with updates:
```bash
# Stash your local changes
git stash

# Pull updates
git pull

# Reapply your changes
git stash pop
```

---

## Repository Management

### For the Maintainer (You)

**Daily Workflow:**
```bash
# Make changes to files
# ...

# See what changed
git status
git diff

# Commit and push
git add .
git commit -m "Your update message"
git push
```

**Best Practices:**
- Commit frequently with clear messages
- Test changes before pushing
- Use branches for major features
- Tag releases for stable versions

### For Collaborators

**Contributing:**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## Version Control Benefits

✅ **Easy Updates** - One command to get latest changes
✅ **Version History** - Track all changes over time
✅ **Backup** - Code safely stored on GitHub
✅ **Collaboration** - Multiple people can work on the project
✅ **Rollback** - Revert to previous versions if needed

---

## License

MIT License - Feel free to use and modify!

---

## Support

For issues or questions:
1. Check the documentation in `design-prompt-app/`
2. Open an issue on GitHub
3. Review commit history for recent changes

---

**Repository:** https://github.com/Ivanvip24/PROMPT_ENGENERING

**Enjoy creating amazing AI-generated designs!** 🎨✨
