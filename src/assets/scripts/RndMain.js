const electron = require('electron');
const { ipcRenderer, clipboard, shell } = electron;
// const path = require('path');
// const fs = require('fs');
// const Datastore = require('nedb');

/* Logging
------------*/
console.log = function (data) {
    ipcRenderer.send('logger', data);
}; // Send all console.logs to Main process
window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.log('[MAIN_WINDOW] > ' + error.stack);
}; // Send window errors to Main process

// function loadPreferences() {
//     let config = new Datastore({
//         filename: path.join(__dirname, 'assets', 'config', 'config.db'),
//         autoload: true
//     })
// }
// alert('sent')F
// loadPreferences()
// ipcRenderer.send('logger', data);

ipcRenderer.on('library-folders', function (){
    console.log('library-folders rndmainjs');
})