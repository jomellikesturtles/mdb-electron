var fs = require('fs');
let args = process.argv.slice(2);
let command = args[0];
let data1 = args[1];
const path = require('path');
const { DEBUG } = require("./shared/util");
let selectedFolders = []

/**
 * Go to the parent folder.
 * @param {string} folder 
 */
function goUp(folder) {
    const myFolder = path.dirname(folder);
    openFolder(myFolder)
}

/**
 * Go to the folder and get the list of children folders.
 * @param {string} folder 
 */
function openFolder(folder) {

    const foldersAndFiles = (fs.readdirSync(folder))
    let returnFolders = []
    foldersAndFiles.forEach(element => {
        const currentFile = path.join(folder, element)
        try {
            if (fs.statSync(currentFile).isDirectory()) {
                DEBUG.log(currentFile)
                returnFolders.push(currentFile)
            }
        } catch (err) {
            DEBUG.log('error code : ' + err.code)
        }
    });
    // display folders in folder
    // send back the folders
    process.send(['explorer-folders', returnFolders])
}

//library,setting,home,browse
function selectFolder() {
    selectedFolders.push()
}

function initializeFileExplorer() {
    DEBUG.log('command', command, 'folder', data1)
    switch (command) {
        case 'up':
            goUp(data1)
            break;
        case 'open':
            openFolder(data1)
            break;
        case 'select':
            selectFolder()
            break;
        default:
            DEBUG.log('invalid command');
            break;
    }
}

initializeFileExplorer()