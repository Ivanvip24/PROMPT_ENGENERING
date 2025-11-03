#!/bin/bash

# Design Prompt Generator - Easy Stopper
# Double-click this file to stop the app if it's running

echo "════════════════════════════════════════════════════════════"
echo "  🛑 Stopping Design Prompt Generator..."
echo "════════════════════════════════════════════════════════════"
echo ""

# Find and kill the node process running on port 3001
PID=$(lsof -ti:3001)

if [ -z "$PID" ]; then
    echo "  ℹ️  App is not currently running."
else
    kill $PID
    echo "  ✓ App stopped successfully!"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
read -p "Press Enter to close this window..."
