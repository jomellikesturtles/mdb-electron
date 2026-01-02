****# Electron & Node.js Architecture Assessment: Modular Strategy

## 1. Findings Summary
*   **"God Class" Anti-Pattern:** The `main.js` file acts as a monolithic controller, handling application lifecycle, window management, IPC routing, and business logic for multiple domains (Library, Torrent, Metadata).
*   **Ad-Hoc Process Management:** Child processes (`webtorrent.js`, `scan-library.js`, etc.) are spawned using raw `child_process.fork` calls scattered throughout `main.js` with no centralized lifecycle management or error handling strategy.
*   **Fragile IPC Contracts:** Communication relies on loosely typed, index-based arrays (e.g., `m[0]`, `m[1]`). This creates implicit dependencies that are hard to debug and prone to breakage during refactoring.
*   **Logic Leakage:** Business logic (e.g., Torrent stream server port handling, library scanning triggers) is leaked into the main process instead of being encapsulated within feature services.

## 2. Risks Identified
*   **Stability Risk:** A failure in a non-critical feature (e.g., a metadata fetcher) handled directly in `main.js` could destabilize the entire application process.
*   **Developer Friction:** Multiple teams working on different features (e.g., "Search" vs. "Playback") will encounter constant merge conflicts in `main.js`.
*   **Untestable Code:** The heavy reliance on global state (`procWebTorrent`, `mainWindow`) and closure-bound functions makes unit testing impossible without spinning up the full Electron runtime.

## 3. Refactoring Target: Torrent Streaming Feature
**Goal:** Decouple the Torrent streaming logic from `main.js` into a self-contained **Torrent Feature Module**. Standardize the Child Process communication using a generic `WorkerService`.

## 4. Before / After File & Folder Structure

### Before
```text
/
├── main.js                 <-- Contains all IPC listeners & fork logic
└── src/
    └── assets/
        └── scripts/
            └── webtorrent.js  <-- Script file, raw process entry
```

### After
```text
/
├── main.js                 <-- Bootstrapper only
└── src/
    └── electron/
        ├── core/
        │   ├── services/
        │   │   ├── worker-manager.service.js
        │   │   └── feature-toggle.service.js
        │   └── ipc-router.js
        └── features/
            └── torrent/    <-- Isolated Feature
                ├── index.js           <-- Module Definition
                ├── torrent.service.js <-- Business Logic
                ├── torrent.ipc.js     <-- IPC Handlers
                └── workers/
                    └── torrent.worker.js
```

## 5. Before / After Key Code Examples

### Before: `main.js` (Tightly Coupled)
```javascript
// main.js
let procWebTorrent;

ipcMain.on('PLAY_TORRENT', function (event, args) {
  procWebTorrent.send(['PLAY_TORRENT', args]);
});

function startTorrentClient() {
  procWebTorrent = require("child_process").fork("src/assets/scripts/webtorrent.js");
  procWebTorrent.on("message", (m) => {
     if (m[0] === 'stream-link') mainWindow.send('stream-link', m[1]);
  });
}
```

### After: `src/electron/features/torrent/` (Modular & Toggled)

**1. Service Layer (`torrent.service.js`)**
```javascript
const WorkerManager = require('../../core/services/worker-manager.service');

class TorrentService {
    constructor(workerManager) {
        this.worker = workerManager.create('torrent', './workers/torrent.worker.js');
    }

    play(magnetLink) {
        return this.worker.send('PLAY', { magnetLink });
    }
}
module.exports = TorrentService;
```

**2. IPC Layer with Toggles (`torrent.ipc.js`)**
```javascript
class TorrentIpc {
    constructor(ipcMain, torrentService, toggleService) {
        this.ipcMain = ipcMain;
        this.service = torrentService;
        this.toggles = toggleService;
    }

    register() {
        this.ipcMain.on('PLAY_TORRENT', (event, args) => {
            // STRATEGY: Toggle-aware execution
            if (this.toggles.isEnabled('NEW_TORRENT_ENGINE')) {
                this.service.play(args).then(link => event.reply('stream-link', link));
            } else {
                // Legacy fallback or no-op
                console.warn('New torrent engine disabled');
            }
        });
    }
}
module.exports = TorrentIpc;
```

## 6. Refactoring Rationale
1.  **Feature Isolation:** Torrent logic is now encapsulated. Changes to the torrent engine or worker script do not require editing `main.js`.
2.  **Stable Interfaces:** The `WorkerManager` provides a consistent API (`send/on`) that abstracts away the complexity of `child_process.fork` and message parsing.
3.  **Testability:** `TorrentService` can be unit tested by mocking `WorkerManager`. `TorrentIpc` can be tested by mocking the service and `ipcMain`.

## 7. Recommendations for Other Similar Modules
Refactor the following strictly following the `src/electron/features/[feature]` hierarchy:

1.  **Library Scanner**
    *   **Current:** `procScanLibrary` / `src/assets/scripts/scan-library.js`
    *   **Target:** `src/electron/features/library/scanner.service.js`
2.  **Metadata Fetcher**
    *   **Current:** `offlineMovieDataService` / `src/assets/scripts/offlineMetadataService.js`
    *   **Target:** `src/electron/features/metadata/metadata.service.js`
3.  **Video Transcoder**
    *   **Current:** `procVideoService` / `src/assets/scripts/video-service.js`
    *   **Target:** `src/electron/features/playback/transcode.service.js`

## 8. Golden Path for Future Features

**Mock Feature: "Live TV" (IPTV)**

**1. Directory Structure**
```
src/electron/features/live-tv/
├── live-tv.module.js    // Composition Root
├── live-tv.service.js   // Business Logic
├── live-tv.ipc.js       // IPC Bindings
└── strategies/          // Strategy Pattern for Providers
    ├── local-tuner.strategy.js
    └── stream-api.strategy.js
```

**2. Implementation (Composition & Strategy)**
```javascript
// live-tv.service.js
class LiveTvService {
    constructor(tunerStrategy, streamStrategy, featureToggles) {
        this.tuner = tunerStrategy;
        this.stream = streamStrategy;
        this.toggles = featureToggles;
    }

    async tuneChannel(channelId) {
        // STRATEGY: Select implementation based on toggle or configuration
        const strategy = this.toggles.isEnabled('USE_CLOUD_TUNER') 
            ? this.stream 
            : this.tuner;
        
        return strategy.tune(channelId);
    }
}
```

**3. Test Suite (Jest)**
```javascript
describe('LiveTvService', () => {
    it('should use Cloud Tuner when toggle is ON', async () => {
        const mockToggles = { isEnabled: jest.fn().mockReturnValue(true) };
        const mockStream = { tune: jest.fn() };
        const service = new LiveTvService({}, mockStream, mockToggles);

        await service.tuneChannel('101');
        expect(mockStream.tune).toHaveBeenCalledWith('101');
    });
});
```
