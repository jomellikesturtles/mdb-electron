# MdbElectron (Movie Database UI)

![Github code size](https://img.shields.io/github/languages/code-size/jomellikesturtles/mdb-electron) ![GitHub repo size](https://img.shields.io/github/repo-size/jomellikesturtles/mdb-electron) ![electron version](https://img.shields.io/npm/v/electron)

**MdbElectron** is a feature-rich desktop application for browsing, tracking, and watching movies. Built with **Angular** and **Electron**, it offers a modern user interface to manage your personal media library, discover new titles via various APIs (OMDb, TMDb), and even stream content using WebTorrent.

## 🚀 Features

*   **Comprehensive Movie Database:** Search and browse detailed information about movies and people using TMDb and OMDb APIs.
*   **Local Library Management:** Track your favorite, bookmarked, and watched movies.
*   **Offline Support:** Utilizes `NeDB` for local data storage, allowing access to your library even without an internet connection.
*   **Cloud Sync:** Optional Firebase integration to sync your library across devices.
*   **Streaming:** Integrated WebTorrent client for streaming and downloading media.
*   **Advanced Search:** Filter content by genre, date, availability, and more.
*   **Video Player:** Built-in video player with subtitle support and floating player mode.
*   **Custom UI:** tailored interface using Bootstrap 5 and Angular Material.

## 🛠 Tech Stack

*   **Framework:** [Angular 15](https://angular.io/)
*   **Desktop Environment:** [Electron 25](https://www.electronjs.org/)
*   **UI Libraries:** [Bootstrap 5](https://getbootstrap.com/), [Angular Material](https://material.angular.io/)
*   **State Management:** [Akita](https://datorama.github.io/akita/)
*   **Database (Local):** [NeDB](https://github.com/louischatriot/nedb)
*   **Database (Cloud):** [Firebase](https://firebase.google.com/) (Firestore, Auth)
*   **Utilities:** `webtorrent`, `moment.js`, `papaparse`

## 🏁 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (Recommended: LTS version compatible with Angular 15)
*   [npm](https://www.npmjs.com/)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/jomellikesturtles/mdb-electron.git
    cd mdb-electron
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## ▶️ Running the Application

You can run the application in two modes: as a standard web application (for UI development) or as a desktop application (Electron).

### Development Mode (Web)

Run the Angular application in the browser with hot-reload:

```bash
npm start
```
*Access the app at `http://localhost:4200`.*

### Electron Mode (Desktop)

Build the Angular app and launch it within the Electron shell:

```bash
npm run start:electron
```

*To run with production optimizations:*
```bash
npm run start:electron-prod
```

### Other Commands

*   **`npm run electron`**: Launches Electron (requires a pre-built Angular app in `dist/`).
*   **`npm run lint`**: Run code linting.
*   **`npm test`**: Run unit tests via Karma.
*   **`npm run e2e`**: Run end-to-end tests via Protractor.

## 📦 Building & Packaging

To package the application for distribution (creates an executable/app bundle):

```bash
npm run pack
```
*This uses `electron-packager` to bundle the application based on your current OS.*

## 📂 Project Structure

```
src/
├── app/
│   ├── core/           # Singleton services, guards, and core logic
│   ├── modules/        # Feature modules (admin, movie, person, settings, etc.)
│   ├── shared/         # Reusable components, pipes, and directives
│   ├── services/       # Data and logic services (Firebase, APIs, etc.)
│   └── app.module.ts   # Main application module
├── assets/             # Static assets (images, icons, data dumps)
├── environments/       # Environment configurations (dev, prod, electron)
├── main.ts             # Angular entry point
└── index.html          # Main HTML file
```

## ⚙️ Configuration

The application uses `src/environments` for configuration.
*   **APIs:** Keys for TMDb, OMDb, and others are managed here.
*   **Firebase:** Firebase configuration object is required for auth and sync features.

## 🤝 Contributing

Contributions are welcome! Please follow the project's coding standards and submit a pull request.

## 📄 License

[MIT](LICENSE)