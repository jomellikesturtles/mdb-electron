# MdbElectron - Project Context

**MdbElectron** is a hybrid desktop application for browsing, managing, and streaming movies. It leverages **Angular** for the UI and **Electron** for desktop integration, filesystem access, and heavy background processing.

## 1. Tech Stack & Environment

*   **Frontend Framework:** Angular 17.3
    *   **UI Libs:** Bootstrap 5 (beta), Angular Material 17.3.
    *   **State Management:** Akita (`@datorama/akita` ^7.1.1).
*   **Desktop Runtime:** Electron 25.3
    *   **Builder:** `electron-packager`.
*   **Database:** `nedb` (Embedded persistent database for local storage).
*   **Key Dependencies:**
    *   `webtorrent`: For streaming/downloading torrents.
    *   `fluent-ffmpeg`: For media processing.
    *   `moment`: Date handling.
*   **Language:** TypeScript (Angular), JavaScript (Electron Main Process).

## 2. Architecture

### Directory Structure (`src/app`)
*   **`core/`**: Singleton services, guards, and app-wide logic (e.g., `logger.service.ts`, `crawler.ts`).
*   **`modules/`**: Feature-based modules enforcing separation of concerns.
    *   `admin`, `events`, `movie`, `person`, `settings`, `user`, `watch`.
*   **`shared/`**: Reusable components, pipes, and directives.
*   **`services/`**: Business logic, API communication, and State Stores (Akita).
*   **`assets/scripts/`**: Node.js scripts for Electron background processes (e.g., `webtorrent.js`, `scan-library.js`).

### State Management (Akita)
*   The application uses **Akita** for state management, specifically the `EntityStore` pattern.
*   Stores are located in `src/app/services/{feature}/{feature}.store.ts`.
*   Examples: `TorrentStore` (`torrentStoreModel`), `MDBMovieStore` (`mdbMovie`), `TMDBMovieStore` (`tmdbMovie`).
*   *Note:* `src/app/app.state.ts` contains legacy/reference NGXS code and should be ignored/removed.

### Electron Architecture (`main.js`)
*   **Main Process:** `main.js` is the entry point.
*   **IPC Communication:** Extensive use of `ipcMain` and `ipcRenderer` for communication between the Angular UI and Node.js backend.
*   **Child Processes:** Heavy operations are forked as separate Node.js processes to avoid blocking the UI thread:
    *   `src/assets/scripts/webtorrent.js` (Torrent Client)
    *   `src/assets/scripts/scan-library.js` (Library Scanner)
    *   `src/assets/scripts/search-movie.js` (Search)
    *   `src/assets/scripts/video-service.js` (Streaming)
*   **Local Data:** Configuration and user data are stored in `src/assets/config/config.db` and other NeDB files.

## 3. Developer Guide

### Scripts
*   **Web Dev (UI only):** `npm start` (Runs `ng serve --proxy-config proxy.conf.json`)
    *   *Access at:* `http://localhost:4200`
*   **Electron Dev:** `npm run electron` (Launches Electron with current build)
*   **Electron Prod Sim:** `npm run start:electron-prod` (Builds Prod Angular + Launches Electron)
*   **Package App:** `npm run pack` (Creates executable via `electron-packager`)

### Key Locations
*   **Angular Entry:** `src/main.ts`
*   **Electron Entry:** `main.js`
*   **Styles:** `src/styles.scss` (Global), `src/custom-mat-styles.scss` (Material Overrides)

## 4. Active Tasks & Status

**From `todolist.md`:**
*   [ ] Add "Refine Search" feature after Advanced Find.

**Known Issues/Notes:**
*   `app.state.ts` appears to be dead code (NGXS) mixed with active Akita usage elsewhere.
*   Electron scripts are manually forked in `main.js`; ensure error handling and process cleanup are robust.

## 5. Conventions
*   **Modularization:** New features should reside in `src/app/modules/`.
*   **State:** Use Akita `EntityStore` for data collections.
*   **Background Tasks:** CPU-intensive tasks must be offloaded to child processes in `src/assets/scripts/`.
*   **Communication:** Use typed IPC channels (defined in `src/assets/IPCMainChannel.json` and `IPCRendererChannel.json`).