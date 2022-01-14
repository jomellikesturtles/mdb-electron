const PROC_NAMES = {
  SCAN_LIBRARY: "scan-library",
};
const SIZE_LIMIT = 5000000000;

DEBUG.log("username:", USERNAME);

function getUserName (){
  return require("os").userInfo().username;
}

const WEBTORRENT_FULL_FILE_PATH = `C:\\Users\\${getUserName()}\\AppData\\Local\\Temp\\webtorrent`;

module.exports = {
  PROC_NAMES,
  SIZE_LIMIT,
  WEBTORRENT_FULL_FILE_PATH,

};
