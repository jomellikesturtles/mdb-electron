var fs = require('fs');
let args = process.argv.slice(2);
let command = args[0];
let data1 = args[1];
const path = require('path');
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
                console.log(currentFile)
                returnFolders.push(currentFile)
            }
        } catch (err) {
            console.log('error code : ' + err.code)
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
    console.log('command', command, 'folder', data1)
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
            console.log('invalid command');
            break;
    }
}

initializeFileExplorer()