// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

enum source {
  TMDB = "TMDB", IMDB = "IMDB", MDB = "MDB", OMDB = "OMDB", Local = "local"
}

export const environment = {
  production: false,
  version: 1,
  firebase: {
    apiKey: 'AIzaSyBPB_9eQbL5ZzYrI-mBqFix96xTXYyFo7U',
    authDomain: 'mdb-project-id.firebaseapp.com',
    databaseURL: 'https://mdb-project-id.firebaseio.com',
    projectId: 'mdb-project-id',
    storageBucket: 'mdb-project-id.appspot.com',
    messagingSenderId: '24146436081',
    appId: '1:24146436081:web:78f0dd1c699e12514eae50'
  },
  devApi: 'http://localhost:8080',
  runConfig: {
    firebaseMode: false,
    springMode: false,
    isElectron: location.protocol === "http:" || location.protocol === "https:" ? false : true,
    useTestData: true,
  },
  language: 'en',
  location: 'ph',
  dataSource: source.TMDB
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
