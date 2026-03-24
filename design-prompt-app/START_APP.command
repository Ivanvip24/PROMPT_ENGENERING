#!/bin/bash

# Design Prompt Generator - Easy Starter
# Double-click this file to start the app!
# Press Cmd+Option+Shift+G to reboot the server

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$APP_DIR/.server.pid"
LOG_FILE="$APP_DIR/.server.log"
PORT=3001

cd "$APP_DIR"

# ─── Function: kill any existing server ──────────────────────────────
kill_server() {
    # Kill by PID file
    if [ -f "$PID_FILE" ]; then
        local pid
        pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null
            sleep 0.5
            kill -0 "$pid" 2>/dev/null && kill -9 "$pid" 2>/dev/null
        fi
        rm -f "$PID_FILE"
    fi
    # Also kill anything on port 3001
    lsof -ti :$PORT 2>/dev/null | xargs kill -9 2>/dev/null
    sleep 0.3
}

# ─── Function: start the server ──────────────────────────────────────
start_server() {
    echo ""
    echo "  Starting server on http://localhost:$PORT ..."
    echo ""
    node server.js > "$LOG_FILE" 2>&1 &
    local pid=$!
    echo "$pid" > "$PID_FILE"
    echo "  Server PID: $pid"
    sleep 1.5
    if kill -0 "$pid" 2>/dev/null; then
        echo "  ✓ Server is running!"
        open "http://localhost:$PORT"
    else
        echo "  ✗ Server failed to start. Check $LOG_FILE"
        cat "$LOG_FILE"
    fi
}

# ─── Function: install hotkey service ────────────────────────────────
install_hotkey_service() {
    local SERVICE_DIR="$HOME/Library/Services"
    local SERVICE_NAME="Reboot Design Prompt App.workflow"
    local SERVICE_PATH="$SERVICE_DIR/$SERVICE_NAME"

    # Only install if not already present or if script path changed
    if [ -d "$SERVICE_PATH" ]; then
        return 0
    fi

    echo "  Installing Cmd+Option+Shift+G hotkey service..."

    mkdir -p "$SERVICE_DIR"
    mkdir -p "$SERVICE_PATH/Contents"

    # Info.plist for the Quick Action (service)
    cat > "$SERVICE_PATH/Contents/Info.plist" << 'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>NSServices</key>
	<array>
		<dict>
			<key>NSMenuItem</key>
			<dict>
				<key>default</key>
				<string>Reboot Design Prompt App</string>
			</dict>
			<key>NSMessage</key>
			<string>runWorkflowAsService</string>
		</dict>
	</array>
</dict>
</plist>
PLIST

    mkdir -p "$SERVICE_PATH/Contents/QuickAction"
    cat > "$SERVICE_PATH/Contents/QuickAction/Info.plist" << 'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>WFQuickActionSurfaces</key>
	<array/>
</dict>
</plist>
PLIST

    # The Automator workflow document (this is a file, not a directory)
    cat > "$SERVICE_PATH/Contents/document.wflow" << WFLOW
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>AMApplicationBuild</key>
	<string>523</string>
	<key>AMApplicationVersion</key>
	<string>2.10</string>
	<key>AMDocumentVersion</key>
	<integer>2</integer>
	<key>actions</key>
	<array>
		<dict>
			<key>action</key>
			<dict>
				<key>AMAccepts</key>
				<dict>
					<key>Container</key>
					<string>List</string>
					<key>Optional</key>
					<true/>
					<key>Types</key>
					<array>
						<string>com.apple.cocoa.string</string>
					</array>
				</dict>
				<key>AMActionVersion</key>
				<string>2.0.3</string>
				<key>AMApplication</key>
				<array>
					<string>Automator</string>
				</array>
				<key>AMCategory</key>
				<string>AMCategoryUtilities</string>
				<key>AMIconName</key>
				<string>Automator</string>
				<key>AMKeyboardShortcutModifiers</key>
				<integer>-1</integer>
				<key>AMParameterProperties</key>
				<dict>
					<key>COMMAND_STRING</key>
					<dict/>
					<key>CheckedForUserDefaultShell</key>
					<true/>
					<key>inputMethod</key>
					<dict/>
					<key>shell</key>
					<dict/>
					<key>source</key>
					<dict/>
				</dict>
				<key>AMProvides</key>
				<dict>
					<key>Container</key>
					<string>List</string>
					<key>Types</key>
					<array>
						<string>com.apple.cocoa.string</string>
					</array>
				</dict>
				<key>AMRequiredResources</key>
				<array/>
				<key>ActionBundlePath</key>
				<string>/System/Library/Automator/Run Shell Script.action</string>
				<key>ActionName</key>
				<string>Run Shell Script</string>
				<key>ActionParameters</key>
				<dict>
					<key>COMMAND_STRING</key>
					<string>$APP_DIR/REBOOT_APP.command</string>
					<key>CheckedForUserDefaultShell</key>
					<true/>
					<key>inputMethod</key>
					<integer>1</integer>
					<key>shell</key>
					<string>/bin/bash</string>
					<key>source</key>
					<string></string>
				</dict>
				<key>BundleIdentifier</key>
				<string>com.apple.RunShellScript-action</string>
				<key>CFBundleVersion</key>
				<string>2.0.3</string>
				<key>CanShowSelectedItemsWhenRun</key>
				<false/>
				<key>CanShowWhenRun</key>
				<true/>
				<key>GroupbyPriority</key>
				<integer>0</integer>
				<key>InputUUID</key>
				<string>A1B2C3D4-E5F6-7890-ABCD-EF1234567890</string>
				<key>Keywords</key>
				<array>
					<string>Shell</string>
					<string>Script</string>
					<string>Command</string>
					<string>Run</string>
				</array>
				<key>Opacity</key>
				<real>1</real>
				<key>OutputUUID</key>
				<string>B2C3D4E5-F6A7-8901-BCDE-F12345678901</string>
				<key>ShowActionWhenRun</key>
				<true/>
				<key>ShowWhenRun</key>
				<false/>
				<key>UUID</key>
				<string>C3D4E5F6-A7B8-9012-CDEF-123456789012</string>
				<key>UnifiedActionInputType</key>
				<string>0</string>
			</dict>
		</dict>
	</array>
	<key>connectors</key>
	<dict/>
	<key>workflowMetaData</key>
	<dict>
		<key>applicationBundleIDsByPath</key>
		<dict/>
		<key>applicationPaths</key>
		<array/>
		<key>inputTypeIdentifier</key>
		<string>com.apple.Automator.nothing</string>
		<key>outputTypeIdentifier</key>
		<string>com.apple.Automator.nothing</string>
		<key>presentationMode</key>
		<integer>15</integer>
		<key>processesInput</key>
		<integer>0</integer>
		<key>serviceInputTypeIdentifier</key>
		<string>com.apple.Automator.nothing</string>
		<key>serviceOutputTypeIdentifier</key>
		<string>com.apple.Automator.nothing</string>
		<key>workflowTypeIdentifier</key>
		<string>com.apple.Automator.servicesMenu</string>
	</dict>
</dict>
</plist>
WFLOW

    echo "  ✓ Service installed!"
    echo ""
    echo "  ⚠  ONE-TIME SETUP REQUIRED:"
    echo "     To bind Cmd+Option+Shift+G:"
    echo "     1. Open System Settings → Keyboard → Keyboard Shortcuts → Services"
    echo "     2. Find 'Reboot Design Prompt App' under 'General'"
    echo "     3. Click 'Add Shortcut' and press Cmd+Option+Shift+G"
    echo ""
}

# ─── Cleanup on exit ─────────────────────────────────────────────────
cleanup() {
    echo ""
    echo "  Shutting down server..."
    kill_server
    echo "  Goodbye!"
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# ─── Main ────────────────────────────────────────────────────────────
clear
echo "════════════════════════════════════════════════════════════"
echo "  🎨 Design Prompt Generator"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "  Hotkey: Cmd+Option+Shift+G → Reboot server"
echo ""

# Kill any leftover server
kill_server

# Install the hotkey service (one-time)
install_hotkey_service

# Ensure REBOOT_APP.command is executable (but don't overwrite it — it's maintained separately)
chmod +x "$APP_DIR/REBOOT_APP.command" 2>/dev/null

# Start the server
start_server

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  Server running. Press Ctrl+C here to stop."
echo "  Press Cmd+Option+Shift+G anywhere to reboot."
echo "════════════════════════════════════════════════════════════"
echo ""

# Keep script alive — monitor the server
while true; do
    # Skip if REBOOT_APP is handling the restart
    if [ -f "$APP_DIR/.reboot.lock" ]; then
        sleep 2
        continue
    fi
    if [ -f "$PID_FILE" ]; then
        pid=$(cat "$PID_FILE")
        if ! kill -0 "$pid" 2>/dev/null; then
            echo "  ⚠ Server process died. Restarting..."
            start_server
        fi
    fi
    sleep 5
done
