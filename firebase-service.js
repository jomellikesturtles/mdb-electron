/**
 * Firebase service
 */

const express = require('express');
// const fs = require('fs')
const app = express()
// import electron from 'electron';
// const electron = require('electron');
// const { shell } = electron;

// window.onerror = function (msg, url, lineNo, columnNo, error) {
//   console.log('[MAIN_WINDOW] > ' + error.stack);
// }; // Send window errors to Main process

let args = process.argv.slice(2);
let url = args[0];
// let myShell = args[1];

// var firebase = require('firebase')

process.on('uncaughtException', function (error) {
  console.log('ERROR!!!!!!!!!!!!!!!!!!!!!!!!!', error);
  process.send(['operation-failed', 'general']);
});

var firebaseConfig = {
  apiKey: "AIzaSyBPB_9eQbL5ZzYrI-mBqFix96xTXYyFo7U",
  authDomain: "mdb-project-id.firebaseapp.com",
  databaseURL: "https://mdb-project-id.firebaseio.com",
  projectId: "mdb-project-id",
  storageBucket: "mdb-project-id.appspot.com",
  messagingSenderId: "24146436081",
  appId: "1:24146436081:web:78f0dd1c699e12514eae50"
};

function initialize() {

  console.log('initialize');
  app.get('/', function (req, res) {
    console.log('initialize get');
    res.json('welcome!')
    // const { shell } = require('electron')
    // firebase.initializeApp(firebaseConfig)
    // console.log(firebase)
    // firebase.auth()
    // var provider = new firebase.auth.GoogleAuthProvider();
    // firebase.auth().signInWithRedirect(provider)
  })
  app.listen(4000, function () {
    console.log('initialize listen');
    console.log('3000!');
    process.send(['app-open', '']);
  })
  // firebase.initializeApp(firebaseConfig)
  // console.log(firebase)
  // firebase.auth()/
  // var provider = new firebase.auth.GoogleAuthProvider();
  // firebase.auth().signInWithRedirect(provider)
  // shell.openExternal('http:\\localhost:4000')
}
console.log('before initialize');
initialize()

// shell.openExternal('http:\\localhost:4000')
console.log('after initialize');

// window.close();
