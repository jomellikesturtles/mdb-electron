/*jshint esversion: 6 */
const { uuidv4 } = require("./src/assets/scripts/shared/util");
const { COLLECTION_NAME, OPERATIONS } = require("./src/assets/scripts/shared/constants");
const { onUserData } = require("./src/assets/scripts/user-media-db");

onUserData(
  JSON.stringify({
    headers: { operation: OPERATIONS.SAVE, subChannel: COLLECTION_NAME.LIST_LINK_MEDIA, uuid: uuidv4() },
    // query: { tmdbId: 122 }
    body: { listId: "Bl8zwPAwNhvby8Hq", tmdbId: 124 }
    // body: { current: 3022, total: 2000 }
    // headers: { operation: OPERATIONS.REMOVE, subChannel: COLLECTION_NAME.PROGRESS, uuid: uuidv4() },
    // query: { tmdbId: 122 }
    // body: { current: 3024, total: 2000 }
    // headers: { operation: OPERATIONS.FIND_IN_LIST, subChannel: COLLECTION_NAME.ALL, uuid: uuidv4() },
    // query: { tmdbIdList: [122, 123] }
    // query: { tmdbId: 122 }
    // body: { tmdbId: 124, rating: 5, content: "ganda lang" }
  })
);
