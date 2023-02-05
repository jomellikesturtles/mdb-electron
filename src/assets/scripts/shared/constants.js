/*jshint esversion: 6 */
const SIZE_LIMIT = 5000000000;

function getUserName() {
  return require("os").userInfo().username;
}

const WEBTORRENT_FULL_FILE_PATH = `C:\\Users\\${getUserName()}\\AppData\\Local\\Temp\\webtorrent`;

const COLLECTION_NAME = Object.freeze({
  LIST: "list",
  LIST_LINK_MEDIA: "listLinkMedia",
  FAVORITE: "favorite",
  BOOKMARK: "bookmark",
  ALL: "all",
  PLAYED: "played",
  PROGRESS: "progress",
  REVIEW: "review"
});

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

module.exports = {
  SIZE_LIMIT,
  WEBTORRENT_FULL_FILE_PATH,
  COLLECTION_NAME,
  OPERATIONS
};
