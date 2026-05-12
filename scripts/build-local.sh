#!/usr/bin/env bash

# ========================
# CONFIGURATION
# ========================
# Run from WSL and sync the current project to a Linux build directory.
WIN_PROJECT_DIR="$(pwd)"
PROJECT_NAME="$(basename "$WIN_PROJECT_DIR")"
WSL_PROJECT_DIR="${WSL_PROJECT_DIR:-/home/damian/${PROJECT_NAME}-build}"
WSL_ANDROID_SDK="/home/damian/Android"
BUILD_PROFILE=${1:-preview}

# ========================
# 1️⃣ Sync project files (Running natively in Linux)
# ========================
echo "Syncing project files to build directory..."
mkdir -p "$WSL_PROJECT_DIR"

# Sync from /mnt/... to /home/... to speed up local Android build.
rsync -av --delete \
    --exclude='node_modules' \
    --exclude='build' \
    --exclude='*.log' \
    --exclude='.git' \
    --exclude='.expo' \
    "$WIN_PROJECT_DIR/" "$WSL_PROJECT_DIR/"

# ========================
# 2️⃣ Run Build
# ========================
# Clear old logs to prevent false-positives in Step 3
# rm -f "$WSL_PROJECT_DIR/build_output.log"
echo "Starting EAS build for profile: $BUILD_PROFILE..."

# 1. Manually Load NVM (This is the magic fix)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 2. Verify Node is now active
if ! command -v npm &> /dev/null; then
    echo "❌ ERROR: NVM failed to load Node. Please check your NVM installation."
    exit 1
fi

echo "Using Node: $(node -v) from $(which npm)"

# 3. Set Android SDK paths
export ANDROID_SDK_ROOT="$WSL_ANDROID_SDK"
export PATH="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$PATH"

cd "$WSL_PROJECT_DIR" || exit

# 4. Execute build
npm install
eas build -p android --profile "$BUILD_PROFILE" --local | tee build_output.log

# ========================
# 3️⃣ Detect APK path and copy back to Windows
# ========================
# We look for the APK path in the log
APK_PATH=$(grep -oP "${WSL_PROJECT_DIR}/.*\.apk" build_output.log | tail -1)

if [ -f "$APK_PATH" ]; then
    # Copy back to the Windows mount path (/mnt/c/...)
    mkdir -p "$WIN_PROJECT_DIR/build"
    cp "$APK_PATH" "$WIN_PROJECT_DIR/build/"
    echo "✅ APK copied to $WIN_PROJECT_DIR/build/"
else
    echo "❌ Could not find APK. Check the build output above."
fi