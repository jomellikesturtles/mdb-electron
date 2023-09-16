/*jshint esversion: 6 */

const { GeneralRepository } = require("./general-repository");
const { ListLinkMediaRepository } = require("./list-link-media-repository");
const { OPERATIONS, COLLECTION_NAME } = require("./shared/constants");
const { DEBUG, getNumberOfPages } = require("./shared/util"); // remove to trigger unhandled promise rejection warning

// find-in-list
// load repositories
const bookmarksRepository = new GeneralRepository(COLLECTION_NAME.BOOKMARK, "tmdbId"); // save
const favoritesRepository = new GeneralRepository(COLLECTION_NAME.FAVORITE, "tmdbId"); // GOOD findone add remove
const listsRepository = new GeneralRepository(COLLECTION_NAME.LIST, "title"); // add update findone remove
const listLinksMediaRepository = new ListLinkMediaRepository(COLLECTION_NAME.LIST_LINK_MEDIA);
const playedRepository = new GeneralRepository(COLLECTION_NAME.PLAYED, "tmdbId");
const progressRepository = new GeneralRepository(COLLECTION_NAME.PROGRESS, ""); // GOOD update findone remove
const reviewsRepository = new GeneralRepository(COLLECTION_NAME.REVIEW, "tmdbId");

/**
 * TODO: add unhandled exception handler
 * @param {*} rawData
 * @param {import('electron').BrowserWindow} mainWindow
 */
function onUserData(rawData, mainWindow) {
  let data = JSON.parse(rawData);
  const headers = data.headers;
  const params = data.params;
  const body = data.body;
  const uuid = headers.uuid;
  DEBUG.log("headers ", headers);
  DEBUG.log("body ", body);
  DEBUG.log("params ", params);
  let functionCalls = [];
  let subChannels = headers.subChannel;
  if (subChannels.includes(COLLECTION_NAME.ALL)) {
    DEBUG.log("subchannels ALL ", subChannels);
    subChannels = `${COLLECTION_NAME.BOOKMARK},${COLLECTION_NAME.FAVORITE},${COLLECTION_NAME.LIST_LINK_MEDIA},${COLLECTION_NAME.PLAYED},${COLLECTION_NAME.PROGRESS}`;
  }
  subChannels = subChannels.split(",");
  DEBUG.log("subchannels ", subChannels);

  subChannels.forEach((collectionName) => {
    DEBUG.log("subChannel ", collectionName);
    switch (collectionName) {
      case COLLECTION_NAME.BOOKMARK:
        // functionCalls.push(Promise.reject("uniqueviolation"));
        functionCalls.push(handleUserData(bookmarksRepository, headers, params, body));
        break;
      case COLLECTION_NAME.FAVORITE:
        functionCalls.push(handleUserData(favoritesRepository, headers, params, body));
        break;
      case COLLECTION_NAME.LIST:
        functionCalls.push(handleUserData(listsRepository, headers, params, body));
        break;
      case COLLECTION_NAME.LIST_LINK_MEDIA:
        functionCalls.push(handleUserData(listLinksMediaRepository, headers, params, body));
        break;
      case COLLECTION_NAME.PLAYED:
        functionCalls.push(handleUserData(playedRepository, headers, params, body));
        break;
      case COLLECTION_NAME.PROGRESS:
        functionCalls.push(handleUserData(progressRepository, headers, params, body));
        break;
      case COLLECTION_NAME.REVIEW:
        functionCalls.push(handleUserData(reviewsRepository, headers, params, body));
        break;
      default:
        break;
    }
  });
  if (functionCalls.length > 1) {
    // COLLECTION_NAME.ALL
    let response = "";
    Promise.allSettled(functionCalls)
      .then((returnData) => {
        DEBUG.log(`allSettled returns: ${JSON.stringify(returnData)}`);

        response = {
          bookmark: mapPromise(returnData[0]),
          favorite: mapPromise(returnData[1]),
          listLinkMedia: mapPromise(returnData[2]),
          played: mapPromise(returnData[3]),
          progress: mapPromise(returnData[4])
        };
        // }

        if (headers.operation == OPERATIONS.FIND_IN_LIST) {
          let resMap = new Map();

          Object.keys(response).forEach((key) => {
            DEBUG.log(key);
            response[key].forEach((e) => {
              if (resMap.get(e.tmdbId)) {
                resMap.set(e.tmdbId, Object.assign(resMap.get(e.tmdbId), { [key]: e }));
              } else {
                resMap.set(e.tmdbId, { [key]: e });
              }
            });
          });
          let myJson = {};
          let myString;
          myJson.data = mapToObj(resMap);
          myJson.myString = myString;
          myJson = myJson.data;
          response = JSON.stringify(myJson);
        }

        sendContents(`user-data-${uuid}`, response, mainWindow);
      })
      .catch((err) => {
        DEBUG.log(`allSettled error:`, err);
        sendContents(`user-data-${uuid}`, ["error", err], mainWindow);
      });
  } else {
    functionCalls[0]
      .then((response) => {
        sendContents(`user-data-${uuid}`, response, mainWindow);
      })
      .catch((err) => {
        sendContents(`user-data-${uuid}`, ["error", err], mainWindow);
      });
  }
}
async function mapPaginated(val) {
  const totalCount = await dbRepo.count({});
}
function mapToObj(map) {
  const obj = {};
  for (let [k, v] of map) obj[k] = v;
  return obj;
}

/**
 *
 * @param {GeneralRepository} dbRepo
 * @param {{operation?: string,uuid?: string,subChannel?: string}} headers
 * @param {*} params
 * @param {*} body
 * @returns
 */
async function handleUserData(dbRepo, headers, params, body) {
  DEBUG.log("handling user data...");
  const operation = headers.operation;
  let hasError = false;
  let errorMessage = "";
  let result;
  switch (operation) {
    case OPERATIONS.SAVE:
      result = dbRepo.save(body);
      break;
    case OPERATIONS.FIND_ONE:
      result = dbRepo.findOne(params);
      break;
    case OPERATIONS.FIND:
      result = dbRepo.find(params);
      break;
    case OPERATIONS.GET_BY_PAGE:
      const DEFAULT_PAGE_SIZE = 3;
      let size = params.size ? params.size : DEFAULT_PAGE_SIZE;
      let page = params.page;
      const skip = (page - 1) * size + 1 - 1;
      params.skip = skip;
      params.limit = size;

      const totalResults = await dbRepo.count({});
      const totalPages = getNumberOfPages(totalResults, size);

      let paginatedResult = await dbRepo.getPaginated(params);
      let theResult = {
        page: page,
        totalResults,
        totalPages,
        results: paginatedResult
      };
      DEBUG.log(`THE RESULT`, theResult);
      result = theResult;
      break;

    case OPERATIONS.FIND_IN_LIST:
      result = dbRepo.getInList(params.tmdbIdList);
      break;
    case OPERATIONS.REMOVE:
      result = dbRepo.remove(params, body);
      break;
    case OPERATIONS.UPDATE:
      result = dbRepo.update(params, body);
      break;
    default:
      hasError = true;
      errorMessage += "no command";
      DEBUG.error(`errorMessage`);
      break;
  }
  return result;
}

/**
 *
 * @param {{status:'rejected'|'fulfilled',reason:string,value:Object|null}} promiseResponse
 * @returns
 */
function mapPromise(promiseResponse) {
  DEBUG.log(`mapPromise ${JSON.stringify(promiseResponse)}`);
  if (promiseResponse) {
    if (promiseResponse.status === "fulfilled") {
      return promiseResponse.value;
    } else {
      return promiseResponse.reason;
    }
  } else {
    return promiseResponse;
  }
}

/**
 *
 * @param {string} channel
 * @param {any} args
 * @param {import('electron').BrowserWindow} theWindow
 */
function sendContents(channel, args, theWindow) {
  // DEBUG.log("sending...", channel, " | ", args);
  DEBUG.log("sending...", channel);
  console.table("sending...", args);
  if (theWindow) theWindow.webContents.send(channel, args); // reply
}

module.exports = {
  onUserData,
  playedRepository
};

// "page": 1,
// results:[]
// "total_pages": 500,
// "total_results": 10000
