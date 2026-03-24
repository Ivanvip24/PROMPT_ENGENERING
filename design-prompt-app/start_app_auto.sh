#!/bin/bash

# Design Prompt Generator - Automated Launcher
# Runs via LaunchAgent daily at 8:50 AM

export PATH="$HOME/.local/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$PATH"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR"

LOG_FILE="$APP_DIR/auto_start.log"
PID_FILE="$APP_DIR/.server.pid"

echo "$(date): Starting Design Prompt Generator..." >> "$LOG_FILE"

# Kill any existing instance on port 3001
EXISTING_PID=$(lsof -ti :3001 2>/dev/null)
if [ -n "$EXISTING_PID" ]; then
    echo "$(date): Killing existing process on port 3001 (PID: $EXISTING_PID)" >> "$LOG_FILE"
    kill $EXISTING_PID 2>/dev/null
    sleep 2
fi

node server.js >> "$LOG_FILE" 2>&1 &
NEW_PID=$!
echo "$NEW_PID" > "$PID_FILE"

echo "$(date): Server started (PID: $NEW_PID)" >> "$LOG_FILE"
