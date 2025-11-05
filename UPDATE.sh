#!/bin/bash

# Quick Update Script for PROMPT_ENGENERING
# Run this to get the latest changes from GitHub

echo "════════════════════════════════════════════════════════════"
echo "  🔄 Updating AI Design Prompt Engineering System"
echo "════════════════════════════════════════════════════════════"
echo ""

cd "$(dirname "$0")"

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes."
    echo ""
    read -p "Stash your changes and update? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📦 Stashing your changes..."
        git stash
        echo ""
    else
        echo "❌ Update cancelled."
        exit 1
    fi
fi

echo "📥 Pulling latest changes from GitHub..."
echo ""
git pull origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "📦 Checking for dependency updates..."
    echo ""
    cd design-prompt-app
    npm install

    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "  ✅ Update Complete!"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "Your system is now up to date. Ready to use!"
    echo ""
else
    echo ""
    echo "❌ Update failed. Please check the error messages above."
    echo ""
    exit 1
fi
