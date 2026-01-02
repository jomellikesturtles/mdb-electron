# macOS Silicon (M1/M2/M3) Setup Guide

This guide outlines the steps required to run and build **mdb-electron** on macOS Apple Silicon devices.

## 1. Prerequisites

### System Requirements
*   **Node.js:** Ensure you are using a Node.js version compatible with the project (recommended: LTS v16 or v18 for this legacy stack).
*   **FFmpeg:** The application relies on `fluent-ffmpeg`, which requires `ffmpeg` to be installed on your system.

### Install FFmpeg
Since the application does not bundle a static binary, you must install it via Homebrew:

```bash
brew install ffmpeg
```

## 2. Dependencies & Native Modules

This project uses dependencies that may require compilation for the ARM64 architecture (e.g., `electron-rebuild`).

### Installation
Run the following commands in the project root:

```bash
# 1. Install standard dependencies
npm install

# 2. Rebuild native modules for Electron + ARM64
# This ensures modules like 'leveldown' (if used by deps) or others are built for Electron's node version and your architecture.
npx electron-rebuild
```

## 3. Running the Application

### Development Mode
To run the app in development mode (Angular + Electron):

```bash
npm run start:electron
```
*Note: If you encounter blank screens or errors, ensure `npx electron-rebuild` completed successfully.*

## 4. Building/Packaging for macOS Silicon

I have added a new script to `package.json` specifically for this:

```bash
npm run pack:mac-arm64
```

This command runs:
`electron-packager . --platform=darwin --arch=arm64 --overwrite`

The output application will be generated in the project root (usually inside a release folder or directly named `MDB-darwin-arm64`).

## 5. Troubleshooting

### "App is damaged and can't be opened"
If you build the app locally and try to run the generated `.app` file, macOS Gatekeeper might block it because it is not code-signed with a valid Apple Developer Certificate.

**Workaround (for local use only):**
You can ad-hoc sign or remove the quarantine attribute:

```bash
xattr -cr path/to/MDB-darwin-arm64/MDB.app
```

### FFmpeg Errors
If scanning libraries fails, verify `ffmpeg` is accessible in your PATH:
```bash
which ffmpeg
```
It should return something like `/opt/homebrew/bin/ffmpeg`.

### WebTorrent Issues
The project uses an older version of `webtorrent`. If you experience crashes during streaming, this may be due to Node.js version incompatibility with the older `webtorrent` or `utp-native` bindings.
*   **Solution:** Ensure you are running the app with the bundled Electron version (which handles its own Node context), and verify `electron-rebuild` was run.
