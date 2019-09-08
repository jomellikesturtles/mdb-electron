process.on('uncaughtException', function (error) {
    console.log(error);
    // process.send(['scrape-failed', 'general']); //mainWindow.webContents.send('scrape-failed', 'general');
});
// let args = process.argv.slice(2);
// let hash = args[0];
// let isDHT = args[1];

function initializeScan() {
    console.log('initialized scan')
}

console.log('outside initializeScan');
initializeScan();
// console.log(hash);
// console.log(isDHT);
