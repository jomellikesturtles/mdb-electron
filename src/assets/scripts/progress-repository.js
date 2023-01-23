/**
 * service for user's data, watchlist, watched; for happy path, we will use TMDB for now.
 */
/*jshint esversion: 8 */
const path = require("path");
const DataStore = require("nedb");

let DEBUG = (() => {
  let timestamp = () => {};
  timestamp.toString = () => {
    return "[DEBUG " + new Date().toLocaleString() + "]";
  };
  return {
    log: console.log.bind(console, "%s", timestamp),
  };
})();

process.send =
  process.send ||
  function (...args) {
    DEBUG.log("SIMULATING process.send", ...args);
  };

process.on("uncaughtException", function (error) {
  DEBUG.log(error);
  process.send(["operation-failed", "general"]);
});

const FILE_NAME = "ProgressRepository";

// function ProgressRepository() {
//   this.db = new DataStore({
//     filename: path.join(__dirname, "..", "db", "played.db"), // node
//     // filename: path.join(process.cwd(), "src", "assets", "db", "progress.db"),
//     autoload: true,
//   });
// }
// ProgressRepository.prototype.save = function (body) {
//   DEBUG.log(`${FILE_NAME} save`, body);
// };


// var ProgressRepository = (function () {
//   "use strict";
//   if (ProgressRepository._instance) {
//       // This allows the constructor to be called multiple times
//       // and refer to the same instance. Another option is to
//       // throw an error.
//       return ProgressRepository._instance;
//   }
//   ProgressRepository._instance = this;
//   ProgressRepository._uuid = uuidv4();
//   console.log(ProgressRepository._uuid)
//   // ProgressRepository initialization code
// };

// ProgressRepository.getInstance = function () {
//   "use strict";
//   console.log(ProgressRepository._uuid)
//   return ProgressRepository._instance || new ProgressRepository();
// }

var ProgressRepository = (function() {
  var privateVar = '';

  function privateMethod () {
    // ...
  }

  return { // public interface
    publicMethod1: function () {
      console.log('in pM 1')
      // All private members are accessible here
    },
    publicMethod2: function () {
    }
  };
})();

function uuidv4() {

  var u='',i=0;
  while(i++<36) {
      var c='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'[i-1],r=Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);
      u+=(c=='-'||c=='4')?c:v.toString(16)
  }
  return u;
}

module.exports = {
  ProgressRepository
};
