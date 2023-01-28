const { DEBUG, uuidv4 } = require("./shared/util");

const path = require("path");
const DataStore = require("nedb");
const { GeneralRepository } = require("./general-repository");

var bookmarksDb = new DataStore({
  filename: path.join(__dirname, "..", "db", "bookmark.db"), // node
  autoload: true,
  timestampData: true
});
var favoritesDb = new DataStore({
  filename: path.join(__dirname, "..", "db", "favorite.db"), // node
  autoload: true,
  timestampData: true
});
var listsDb = new DataStore({
  filename: path.join(__dirname, "..", "db", "list.db"), // node
  autoload: true,
  timestampData: true
});
var listLinksMediaDb = new DataStore({
  filename: path.join(__dirname, "..", "db", "listLink.db"), // node
  autoload: true,
  timestampData: true
});
var playedDb = new DataStore({
  filename: path.join(__dirname, "..", "db", "played.db"), // node
  autoload: true,
  timestampData: true
});
var progressDb = new DataStore({
  filename: path.join(__dirname, "..", "db", "progress.db"), // node
  autoload: true,
  timestampData: true
});
var ratingDb = new DataStore({
  filename: path.join(__dirname, "..", "db", "rating.db"), // node
  autoload: true,
  timestampData: true
});
var reviewDb = new DataStore({
  filename: path.join(__dirname, "..", "db", "review.db"), // node
  // filename: path.join(process.cwd(), "src", "assets", "db", "progress.db"),
  autoload: true,
  timestampData: true
});

// find-in-list
let bookmarksRepository = new GeneralRepository(bookmarksDb, "tmdbId");
let favoritesRepository = new GeneralRepository(favoritesDb, "tmdbId"); // GOOD findone add remove
let listsRepository = new GeneralRepository(listsDb, "title"); // add update findone remove
let listLinksMediaRepository = new GeneralRepository(listLinksMediaDb);
let playedRepository = new GeneralRepository(playedDb, "tmdbId");
let progressRepository = new GeneralRepository(progressDb); // GOOD update findone remove
let ratingsRepository = new GeneralRepository(ratingDb, "tmdbId");
let reviewsRepository = new GeneralRepository(reviewDb, "tmdbId");

let OPERATIONS = Object.freeze({
  FIND: "find",
  FIND_ONE: "find-one",
  FIND_IN_LIST: "find-in-list",
  UPDATE: "update",
  SAVE: "save",
  REMOVE: "remove",
  GET_BY_PAGE: "get-by-page",
  COUNT: "count"
});

let SUB_CHANNEL = Object.freeze({
  LIST: "list",
  LISTLINKMEDIA: "listLinkMovie",
  FAVORITE: "favorite",
  BOOKMARK: "bookmark",
  ALL: "all",
  PLAYED: "played",
  PROGRESS: "progress",
  REVIEW: "review"
});
function onUserData(rawData) {
  let data = JSON.parse(rawData);
  const headers = data.headers;
  const query = data.query;
  const body = data.body;
  const uuid = headers.uuid;
  DEBUG.log("headers ", headers);
  DEBUG.log("body ", body);
  DEBUG.log("headers TO ", typeof headers);
  DEBUG.log("body TO ", typeof body);
  let functionCalls = [];
  // try {
  let subChannels = headers.subChannel.split(",");
  // [];
  if (subChannels.includes(SUB_CHANNEL.ALL)) {
    DEBUG.log("subchannels ALL ", subChannels);
    subChannels = `${SUB_CHANNEL.BOOKMARK},${SUB_CHANNEL.FAVORITE},${SUB_CHANNEL.LISTLINKMEDIA},${SUB_CHANNEL.PLAYED},${SUB_CHANNEL.PROGRESS}`;
  }
  subChannels = subChannels.split(",");
  DEBUG.log("subchannels ", subChannels);

  subChannels.forEach((subChannel) => {
    DEBUG.log("subChannel ", subChannel);
    switch (subChannel) {
      case SUB_CHANNEL.BOOKMARK:
        functionCalls.push(Promise.reject("uniqueviolation"));
        // functionCalls.push(handleUserData(bookmarksRepository, headers, query, body));
        break;
      case SUB_CHANNEL.FAVORITE:
        functionCalls.push(handleUserData(favoritesRepository, headers, query, body));
        break;
      case SUB_CHANNEL.LIST:
        functionCalls.push(handleUserData(listsRepository, headers, query, body));
        break;
      case SUB_CHANNEL.LISTLINKMEDIA:
        functionCalls.push(handleUserData(listLinksMediaRepository, headers, query, body));
        break;
      case SUB_CHANNEL.PLAYED:
        functionCalls.push(handleUserData(playedRepository, headers, query, body));
        break;
      case SUB_CHANNEL.PROGRESS:
        functionCalls.push(handleUserData(progressRepository, headers, query, body));
        // TODO: handle auto add played
        break;
      // case SUB_CHANNEL.REVIEW:
      //   handleUserData(ratingsRepository, headers, query, body);
      //   break;
      case SUB_CHANNEL.REVIEW:
        functionCalls.push(handleUserData(reviewsRepository, headers, query, body));
        break;
      default:
        break;
    }
  });
  if (functionCalls.length >= 1) {
    // SUB_CHANNEL.ALL
    Promise.allSettled(functionCalls)
      .then((data) => {
        let response = {
          bookmark: mapPromise(data[0]),
          favorite: mapPromise(data[1]),
          listLinkMedia: mapPromise(data[2]),
          played: mapPromise(data[3]),
          progress: mapPromise(data[4])
        };
        sendContents(`user-data-${uuid}`, response);
      })
      .catch((err) => {
        sendContents(`user-data-${uuid}`, ["error", err]);
      });
  } else {
    functionCalls[0]
      .then((response) => {
        sendContents(`user-data-${uuid}`, response);
      })
      .catch((err) => {
        sendContents(`user-data-${uuid}`, ["error", err]);
      });
  }
  // Promise.allSettled(functionCalls);
  // functionCalls;
  // } catch (err) {
  // DEBUG.error(`errorMessage ${JSON.stringify(err)}`);
  // sendContents(`user-data-${uuid}`, `${JSON.stringify(err)}`);
  // }
}
/**
 *
 * @param {{status:'rejected'|'fulfilled',reason:string,value:Object|null}} promiseResponse
 * @returns
 */
function mapPromise(promiseResponse) {
  if (promiseResponse.status === "fulfilled") {
    return promiseResponse.value;
  } else {
    return promiseResponse.reason;
  }
}
/**
 *
 * @param {GeneralRepository} dbRepo
 */
async function handleUserData(dbRepo, headers, query, body) {
  DEBUG.log("handling user data...");
  const operation = headers.operation;
  let hasError = false;
  let errorMessage = "";
  const uuid = headers.uuid;
  let result;
  switch (operation) {
    case OPERATIONS.SAVE:
      result = dbRepo.save(body);
      break;
    case OPERATIONS.FIND_ONE:
      result = dbRepo.findOne(query);
      break;
    case OPERATIONS.FIND_IN_LIST:
      result = dbRepo.getInList(body.idList);
      break;
    case OPERATIONS.REMOVE:
      result = dbRepo.remove(query, body);
      break;
    case OPERATIONS.UPDATE:
      result = dbRepo.update(query, body);
      break;
    default:
      hasError = true;
      errorMessage += "no command";
      DEBUG.error(`errorMessage`);
      break;
  }
  return result;
}

onUserData(
  JSON.stringify({
    // headers: { operation: OPERATIONS.SAVE, subChannel: SUB_CHANNEL.FAVORITE, uuid: uuidv4() },
    // query: { tmdbId: 122 }
    // body: { current: 3022, total: 2000 }
    // headers: { operation: OPERATIONS.REMOVE, subChannel: SUB_CHANNEL.PROGRESS, uuid: uuidv4() },
    // query: { tmdbId: 122 }
    // body: { current: 3024, total: 2000 }
    headers: { operation: OPERATIONS.FIND_ONE, subChannel: SUB_CHANNEL.ALL, uuid: uuidv4() },
    query: { tmdbId: 122 }
    // body: { tmdbId: 124, rating: 5, content: "ganda lang" }
  })
);

function sendContents(param1, param2) {
  DEBUG.log("sending...", param1, " | ", param2);
}
