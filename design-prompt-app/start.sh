#!/bin/bash
# AXKAN Design Prompt Generator — auto-restart wrapper
# Usage: ./start.sh
# The server exits with code 42 after a self-update (git pull).
# This script catches that and restarts automatically.

cd "$(dirname "$0")"

while true; do
  echo ""
  echo "━━━ Starting server... ━━━"
  echo ""
  node server.js
  EXIT_CODE=$?

  if [ $EXIT_CODE -eq 42 ]; then
    echo ""
    echo "🔄 Update detected (exit 42) — restarting in 1s..."
    sleep 1
  else
    echo ""
    echo "Server exited with code $EXIT_CODE. Stopped."
    exit $EXIT_CODE
  fi
done
