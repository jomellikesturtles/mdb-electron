# MdbElectron - Project Context

**MdbElectron** is a hybrid media management application designed for browsing, organizing, and streaming local and online movies.

## Project Goal
*   **Multi-Platform:** Supports both **Web-app** and **Desktop application** builds.
*   **OS Compatibility:** Fully compatible with **Windows** and **macOS**.
*   **Offline-First:** Designed to function without an internet connection using local metadata and cached data.
*   **Local Data Architecture:** Desktop build utilizes **IPC communication** to connect with a Node.js backend, storing data locally via **NeDB**.

## 1. Tech Stack & Environment

*   **Frontend Framework:** Angular 17+ (Ivy enabled)
    *   **UI Libs:** Angular Material (Heavily customized), **No Bootstrap**.
    *   **State Management:** NGXS (Redux pattern).
*   **Desktop Runtime:** Electron 25.3
    *   **Builder:** `electron-packager`.
*   **Database:** `nedb` (Embedded persistent database).
*   **Key Dependencies:**
    *   `webtorrent`: Streaming/downloading.
    *   `fluent-ffmpeg`: Media processing.
    *   `moment`: Date handling.

## 2. Architecture & Modules

### Directory Structure (`src/app`)
*   **`core/`**: Singletons (Services, Guards, TopNav).
*   **`shared/`**:
    *   **`ui/`**: Atomic Design System (`mdb-button`, `mdb-input`, `mdb-card`, etc.). **ALWAYS use these over raw HTML/Material.**
    *   **`components/`**: Complex shared widgets (`movie-card`, `card-list`).
*   **`modules/`**: Feature modules (`movie`, `user`, `settings`, `admin`).
*   **`models/`**: Shared interfaces (e.g., `user.model.ts` for `IUserProfile`).

### UI/UX Design System ("Netflix Dark")
*   **Theme:** Dark mode only. Background `#141414`, Primary Red `#E50914`, Text White.
*   **Styling Source:** `src/styles.scss` contains global variables, utility classes (replacing Bootstrap), and Material overrides.
*   **Components:**
    *   **Buttons:** Use `<mdb-button variant="...">`. Primary=Red, Secondary=Gray.
    *   **Inputs:** Use `<mdb-input>` (Wraps MatFormField + Error handling).
    *   **Cards:** Use `<mdb-card>` (Dark background, consistent padding).
    *   **Lists:** `<app-card-list>` defaults to horizontal scrolling.

### Electron Architecture (`main.js`)
*   **Main Process:** `main.js` serves as the monolithic entry point. It manages window lifecycle (`mainWindow`, `splashWindow`), system tray, and orchestrates background tasks.
    *   **Security:** Currently uses `nodeIntegration: true` and `webSecurity: false` in `mainWindow` to allow direct Node.js access from Angular. *Note: This is a legacy pattern and a security risk.*
*   **IPC Communication:**
    *   **Pattern:** Channel-based communication defined in JSON configs to ensure type safety.
    *   **Renderer -> Main:** Channels defined in `src/assets/IPCRendererChannel.json` (e.g., `SCAN_LIBRARY_START`, `PLAY_TORRENT`).
    *   **Main -> Renderer:** Channels defined in `src/assets/IPCMainChannel.json` (e.g., `ScanLibraryResult`, `BookmarkAddSuccess`).
*   **Child Processes (Background Tasks):**
    *   Heavy operations are offloaded to separate Node.js processes using `child_process.fork()` to prevent blocking the UI thread.
    *   **Scripts Location:** `src/assets/scripts/`.
    *   **Key Scripts:**
        *   `webtorrent.js`: Handles torrent streaming and downloading.
        *   `scan-library.js`: Recursively scans local folders for media files and identifies them using regex/TMDB.
        *   `search-movie.js`: Handles movie search logic.
        *   `video-service.js`: Spawns a local server to stream video files.
    *   **Communication:** Child processes send messages back to `main.js` via `process.send()`, which are often forwarded to the Renderer.
*   **Data Persistence:**
    *   **NeDB:** Embedded persistent database used by both Main and Child processes.
    *   **Locations:** `src/assets/config/config.db` (User prefs), `src/assets/scripts/src/assets/db/` (Library, Metadata).
    *   **Direct Access:** `main.js` and child scripts often instantiate `Datastore` directly.
*   **Architecture Notes:**
    *   `src/electron/core/ModuleManager.js` exists but is not yet fully integrated, indicating a partial or planned refactor towards a modular backend. Currently, `main.js` contains significant business logic.

### Desktop Core Features
*   **Local Library Scanning:** Ability to scan user-specified local folders for video files recursively.
*   **Media Identification:** Automated parsing of filenames using specified regex patterns to identify movie titles and release years.
*   **Local Streaming:** Hosts an internal Node.js server to stream local video files to the UI via `localhost`.

## 3. Developer Guide

### Development
*   **Web Dev:** `npm start` (Runs `ng serve`). Note: IPC features will fail in browser mode; mocks are used where available.
*   **Electron Dev:** `npm run electron`.

### Key Workflows
1.  **Adding a Feature:** Create module in `src/app/modules/`. Register routes. Use `SharedModule` for UI.
2.  **State Management:** Use NGXS stores (`src/app/store/`).
3.  **Authentication:** Handled by `AuthenticationService` and `MdbGuard`.

## 4. Conventions
*   **Strict Typing:** Use interfaces from `src/app/models/`.
*   **UI Components:** Do not use `mat-form-field` or `input` directly; use `mdb-input`. Do not use `bootstrap` classes. Use `d-flex`, `mb-3`, etc., from `styles.scss`.
*   **Verification:** Always check for compilation errors after changes (`npx ng build --watch=false`).
*   **Visuals:** Use DevTools MCP to verify UI fidelity.