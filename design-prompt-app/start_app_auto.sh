#!/bin/bash

# Design Prompt Generator - Automated Launcher
# Runs via LaunchAgent daily at 8:50 AM

APP_DIR="$(dirname "$0")"
cd "$APP_DIR"

LOG_FILE="$APP_DIR/auto_start.log"

echo "$(date): Starting Design Prompt Generator..." >> "$LOG_FILE"

# Kill any existing instance on port 3001
EXISTING_PID=$(lsof -ti :3001 2>/dev/null)
if [ -n "$EXISTING_PID" ]; then
    echo "$(date): Killing existing process on port 3001 (PID: $EXISTING_PID)" >> "$LOG_FILE"
    kill $EXISTING_PID 2>/dev/null
    sleep 2
fi

/usr/local/bin/npm start >> "$LOG_FILE" 2>&1 &

echo "$(date): Server started (PID: $!)" >> "$LOG_FILE"
