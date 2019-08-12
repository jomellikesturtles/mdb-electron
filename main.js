const { app, BrowserWindow, ipcMain, dialog, Menu, Tray, shell, session, clipboard } = require('electron')
const validExtensions = ['.mp4', '.mkv', '.mpeg', '.avi', '.wmv', '.mpg',]
const papa = require('papaparse');
// import * as path from 'path'
// import * as url from 'url'const 
cp = require('child_process');
const path = require('path');
const fs = require('fs');
const Datastore = require('nedb');
let win
let mainWindow
let currentCondition = true;
let stream;
let result = [];
let releaseFrom = 2012
let releaseTo = 2019
let searchQuery = {
    title: '[',
    genres: [''],
    titleType: ['movie', 'tvMovie'],
    releaseFrom: 1960,
    releaseTo: 2019,
    ratingFrom: 7.0,
    ratingTo: 9.8
}

/**
 * Creates the browser window
 */
function createWindow() {

    mainWindow = new BrowserWindow({
        minWidth: 762,
        minHeight: 700,
        show: true,
        // frame: false,
        backgroundColor: '#1e2a31',
        webPreferences: {
            experimentalFeatures: true,
            nodeIntegration: true
        },
        title: 'MDB'
    });
    mainWindow.webContents.openDevTools()
    mainWindow.loadURL(`file://${__dirname}/dist/mdb-electron/index.html`); // It will load in production mode

    // Event when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

// console.log(`${__dirname}`)
// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // macOS specific close process
    if (mainWindow === null) {
        createWindow()
    }
})

/** Functions */
/**
 * Checks if file is a video file
 */
function isVideoFile(params) {
    var isVideoFile = false
    validExtensions.forEach(element => {
        if (params.indexOf(element) > 0) {
            isVideoFile = true
            return isVideoFile
        }
    });
    return isVideoFile
}

/**
 * Reads/scans the directory
 */
function readDirectory(value) {
    if (!fs.existsSync(value)) {
        console.log("no dir ", value);
        return;
    }
    var files = fs.readdirSync(value);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(value, files[i]);
        var stat = fs.lstatSync(filename);

        if (stat.isDirectory()) {
            readDirectory(filename); //recurse
        }
        else {
            if (isVideoFile(filename)) {
                // console.log(filename);
                // addToList(files[i])
                // addToList2(value, files[i])
            }
        }
    }
}

/* IPC Event handling
----------------------*/
/* Logger */
ipcMain.on('logger', function (event, data) {
    logger('logger..')
    console.log(data);
}); // Handle console.logs from Renderer

/** Set to maximized */
ipcMain.on('app-max', function () {
    mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
});

ipcMain.on('open-folder', function (folder) {
    shell.showItemInFolder(folder)
    shell.showItemInFolder(__dirname)
})
ipcMain.on('file-explorer', function (folder) {
    fs.readFileSync(__dirname)
})
ipcMain.on('scan-library', function (data) {
    let libraryFolders = ["D:\\workspaces\\test data folder", "C:\\Users\\Lenovo\\Downloads\\Completed Downloads"]
    libraryFolders.forEach(folder => {
        readDirectory(folder)
    })
    // fs.readFileSync(__dirname) // illegal operation on a directory, read
})


function resultObjectTemplate(record) {
    console.log(record)
    return {
        tconst: record['tconst'],
        titleType: record['titleType'],
        primaryTitle: record['primaryTitle'],
        originalTitle: record['originalTitle'],
        isAdult: record['isAdult'],
        startYear: record['startYear'],
        endYear: record['endYear'],
        runtimeMinutes: record['runtimeMinutes'],
        genres: record['genres']
    }
}

function ratingCondition(params) {
    if (record['tconst'] == params) {
        if (record['averageRating'] >= releaseFrom && record['averageRating'] <= releaseTo) {
            return true
        }
    }
}

function hasTitleType(titleType) {
    var result = false
    for (var i = 0; i < searchQuery['titleType'].length; i++) {
        if (titleType.indexOf(searchQuery['titleType'][i]) > -1) {
            // console.log('found element',element);
            return true;
        }
    }
    return result
}

function titleCondition(record) {
    // id;query, yearfrom,yearto, ratings, genres, titleType
    if (hasTitleType(record['titleType'])) {
        if (record['startYear'] >= searchQuery['releaseFrom'] &&
            record['startYear'] <= searchQuery['releaseTo']) {
            if ((record['primaryTitle'].toLowerCase().includes(searchQuery['title'])) || (record['primaryTitle'].toLowerCase().includes(searchQuery['title']))) {
                return true
            }
        }
    }
    return false
}
function procData(results, parser) {

    var condition = currentCondition ? titleCondition : ratingCondition;
    // console.log(results.data.length)
    for (let c = 0; c < results.data.length; c++) {
        let record = results.data[c];
        if (condition(record)) {
            // if (i > count) { //count: sets limits of how many results to display
            //     parser.abort();
            //     stream.close();
            //     break;
            // } else {
            result.push(resultObjectTemplate(record));
            // console.log(record);
            //     i++;
            // }
        }
    }
}
function searchMovie(data) {
    stream = fs.createReadStream(path.join('D:\\workspaces\\git repos\\mdb-electron\\master\\mdb-electron\\src\\assets\\movie database', 'title.basics.tsv', 'data.tsv'))
        .once('open', function () {
            papa.parse(stream, {
                delimiter: '\t',
                escapeChar: '\\',
                header: true,
                chunk: procData,
                complete: finSearch,
                error: function (error) {
                    console.log(error);
                }
            });
        })
        .on('error', function (err) {
            // process.send(['search-failed', 'read']); //mainWindow.webContents.send('search-failed', 'read');
            console.log(err);
        });
}

function finSearch() {
    console.log('result: ', result);
    // process.exit(0);
};
ipcMain.on('search-query', function (data) {
    searchQuery['title'] = data
    console.log(searchQuery['title']);
    searchMovie(data)
    // cp.fork
})