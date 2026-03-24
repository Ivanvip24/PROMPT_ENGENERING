#!/bin/bash
export PATH="/Users/ivanvalenciaperez/.local/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$PATH"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$APP_DIR/.server.pid"
LOG_FILE="$APP_DIR/.server.log"
LOCK_FILE="$APP_DIR/.reboot.lock"
PORT=3001

cd "$APP_DIR"

# Create lock so the monitor loop in START_APP doesn't also restart
touch "$LOCK_FILE"

# Kill existing server
if [ -f "$PID_FILE" ]; then
    pid=$(cat "$PID_FILE")
    kill "$pid" 2>/dev/null
    sleep 0.5
    kill -0 "$pid" 2>/dev/null && kill -9 "$pid" 2>/dev/null
    rm -f "$PID_FILE"
fi
lsof -ti :$PORT 2>/dev/null | xargs kill -9 2>/dev/null
sleep 0.3

# Restart server
node server.js > "$LOG_FILE" 2>&1 &
NEW_PID=$!
echo "$NEW_PID" > "$PID_FILE"

# Remove lock
rm -f "$LOCK_FILE"

sleep 1.5
if kill -0 "$NEW_PID" 2>/dev/null; then
    osascript -e 'display notification "Server rebooted on port 3001 — your work is preserved" with title "Design Prompt Generator" subtitle "✓ Ready"'
    open "http://localhost:3001"
else
    osascript -e 'display notification "Server failed to start!" with title "Design Prompt Generator" subtitle "✗ Error"'
fi
