#!/bin/bash

# Quick Setup Script for PROMPT_ENGENERING
# Run this after cloning the repository

echo "════════════════════════════════════════════════════════════"
echo "  🎨 AI Design Prompt Engineering System - Setup"
echo "════════════════════════════════════════════════════════════"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo ""
    echo "Please install Node.js first:"
    echo "👉 Visit: https://nodejs.org"
    echo "👉 Download and install the LTS version"
    echo ""
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Navigate to the app directory
cd "$(dirname "$0")/design-prompt-app"

echo "📦 Installing dependencies..."
echo ""
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "  ✅ Setup Complete!"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "To start the app:"
    echo "  • Double-click: design-prompt-app/START_APP.command"
    echo "  • Or run: cd design-prompt-app && npm start"
    echo ""
    echo "Then open your browser to: http://localhost:3001"
    echo ""
else
    echo ""
    echo "❌ Installation failed. Please check the error messages above."
    echo ""
    exit 1
fi
