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

class ListsRepository {
  static instance
  // instance = this.constructor.instance;
  ;
  _this;
  #listDbLocal;
  instanceUUID;
  constructor() {
    if (this.instance) {
      return this.instance
    }
    this.instance = this;
    DEBUG.log('ListsRepository CONTROLLER1')
    // if (instance) return instance;
    // this.instance = this;
    this._this = this;
    this.instanceUUID = uuidv4();
    this.#listDbLocal = new DataStore({
      // filename: path.join(__dirname, "..", "db", "played.db"), // node
      filename: path.join(process.cwd(), "src", "assets", "db", "lists.db"),
      autoload: true,
    });
  }
  getInstanceUUID () {
    return this.instanceUUID;
  }
  save(body) {
    DEBUG.log('ListsREpo save body', body)
  }
  findPlayed(tmdbId) {
    let root = this;
    return new Promise(function (resolve, reject) {
      DEBUG.log("findPlayed tmdbId", tmdbId);
      DEBUG.log("findPlayed constructor", constructor());
      root.#listDbLocal.findOne(
        { tmdbId: parseInt(tmdbId, 10) },
        function (err, doc) {
          if (!err) {
            DEBUG.log("played found", doc);
            if (doc) {
              doc = root.convertToFEWatched(doc);
              resolve(doc);
            } else {
              resolve(null);
            }
          } else {
            DEBUG.log(err);
          }
          // process.exit(0);
        }
      );
    });
  }

  /**
   * Gets watched movies in list.
   * @param {any[]} idList list of id
   * @returns {Promise<any[]>} list of watched movies
   */
  getPlayedInList(idList) {
    console.log("getPlayedInList idList2: ", idList);
    return new Promise(function (resolve, reject) {
      playedDbLocal.find({ tmdbId: { $in: idList } }, function (err, docs) {
        if (!err) {
          let toList = [];
          docs.forEach((element) => {
            toList.push(root.convertToFEWatched(element));
            console.log("PUSHING ", this.convertToFEWatched(element));
          });
          DEBUG.log("DOCS: ", docs);
          resolve(toList);
        } else {
          DEBUG.log("ERROR", err);
          reject(err);
        }
      });
    });
  }

  convertToFEWatched(arg) {
    return {
      id: arg._id,
      tmdbId: arg.tmdb,
      imdbId: arg.imdb,
      title: arg.title,
      year: arg.yr,
      percentage: arg.pctg,
    };
  }

}

function uuidv4() {
  var u='',i=0;
  while(i++<36) {
      var c='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'[i-1],r=Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);
      u+=(c=='-'||c=='4')?c:v.toString(16)
  }
  return u;
}
class Singleton {
  constructor() {
      const instance = this.constructor.instance;
      const instanceUUID = this.constructor.instanceUUID
      if (instance) {
          return instance;
      }

      this.constructor.instance = this;
      this.constructor.instanceUUID = uuidv4();
  }

  foo() {
      // ...
  }
  getInstanceUUID() {
    return this.constructor.instanceUUID;
  }
}

module.exports = {ListsRepository, Singleton}
