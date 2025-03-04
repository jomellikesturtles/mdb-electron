enum source {
  TMDB = "TMDB", IMDB = "IMDB", MDB = "MDB", OMDB = "OMDB", Local = "local"
}
export const environment = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyBPB_9eQbL5ZzYrI-mBqFix96xTXYyFo7U',
    authDomain: 'mdb-project-id.firebaseapp.com',
    databaseURL: 'https://mdb-project-id.firebaseio.com',
    projectId: 'mdb-project-id',
    storageBucket: 'mdb-project-id.appspot.com',
    messagingSenderId: '24146436081',
    appId: '1:24146436081:web:78f0dd1c699e12514eae50'
  },
  runConfig: {

    // firebaseMode: false,
    springMode: true,
    // electron: location.protocol === "http:" || location.protocol === "https:" ? false : true,
    // useTestData: true,
    environment: location.protocol,
    firebaseMode: true,
    electron: false,
    useTestData: false
    // firebaseMode: true,
    // electron: false,
    // useTestData: false

  },
  dataSource: source.TMDB
};
