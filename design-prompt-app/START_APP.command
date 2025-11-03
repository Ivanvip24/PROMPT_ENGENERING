#!/bin/bash

# Design Prompt Generator - Easy Starter
# Just double-click this file to start the app!

cd "$(dirname "$0")"

echo "════════════════════════════════════════════════════════════"
echo "  🎨 Starting Design Prompt Generator..."
echo "════════════════════════════════════════════════════════════"
echo ""
echo "  Please wait a moment while the app starts up..."
echo ""

# Start the server
npm start

# Keep terminal open if there's an error
read -p "Press Enter to close this window..."
