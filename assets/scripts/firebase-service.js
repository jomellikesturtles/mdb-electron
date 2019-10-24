/**
 * Firebase service
 */

var firebase = require('firebase')

var firebaseConfig = {
    apiKey: "AIzaSyBGOUmCJ8fcnfSJhtOrXSwKdlcs4mYYtvA",
    // authDomain: "project-id.firebaseapp.com",
    databaseURL: "https://zeta-bebop-656.firebaseio.com/",
    projectId: "zeta-bebop-656",
    storageBucket: "gs://zeta-bebop-656.appspot.com",
    // messagingSenderId: "sender-id",
    // appId: "app-id",
    // measurementId: "G-measurement-id",
};

firebase.initializeApp(firebaseConfig)
console.log(firebase)


// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="/__/firebase/7.2.0/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->

// <!-- Initialize Firebase -->
// <script src="/__/firebase/init.js"></script>