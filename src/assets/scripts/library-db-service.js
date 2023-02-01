/*jshint esversion: 6 */

const { GeneralRepository } = require("./general-repository");
const { OPERATIONS } = require("./shared/constants");
const { DEBUG } = require("./shared/util"); // remove to trigger unhandled promise rejection warning

const libraryRepository = new GeneralRepository("library", "fullFilePath");

/**
 * TODO: add unhandled exception handler
 * @param {*} rawData
 * @param {import('electron').BrowserWindow} mainWindow
 */
function onLibrary(rawData, mainWindow) {
  let data = JSON.parse(rawData);
  const headers = data.headers;
  const query = data.query;
  const body = data.body;
  const uuid = headers.uuid;
  DEBUG.log("headers ", headers);
  DEBUG.log("body ", body);
  handleUserData(libraryRepository, headers, query, body)
    .then((response) => {
      sendContents(`library-${uuid}`, response, mainWindow);
    })
    .catch((err) => {
      DEBUG.log(`allSettled error:`, err);
      sendContents(`library-${uuid}`, ["error", err], mainWindow);
    });
}

/**
 *
 * @param {GeneralRepository} dbRepo
 * @param {{operation?: string,uuid?: string,subChannel?: string}} headers
 * @param {*} query
 * @param {*} body
 * @returns
 */
async function handleUserData(dbRepo, headers, query, body) {
  DEBUG.log("handling user data...");
  const operation = headers.operation;
  let hasError = false;
  let errorMessage = "";
  let result;
  switch (operation) {
    case OPERATIONS.SAVE:
      result = dbRepo.save(body);
      break;
    case OPERATIONS.FIND:
      result = dbRepo.find(query);
      break;
    case OPERATIONS.FIND_ONE:
      result = dbRepo.findOne(query);
      break;
    case OPERATIONS.FIND_IN_LIST:
      result = dbRepo.getInList(query.tmdbIdList);
      break;
    case OPERATIONS.REMOVE:
      result = dbRepo.remove(query, body);
      break;
    case OPERATIONS.UPDATE:
      result = dbRepo.update(query, body);
      break;
    default:
      hasError = true;
      errorMessage += "no command found";
      DEBUG.error(`errorMessage ${errorMessage}`);
      break;
  }
  return result;
}

/**
 *
 * @param {string} channel
 * @param {any} args
 * @param {import('electron').BrowserWindow} theWindow
 */
function sendContents(channel, args, theWindow) {
  DEBUG.log("sending...", channel, " | ", args);
  if (theWindow) theWindow.webContents.send(channel, args); // reply
}

module.exports = {
  onLibrary
};

/**
 *  add/remove directory
 *  change movie in directory
 *  */
