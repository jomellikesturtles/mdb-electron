/**
 * General repository
 */

let DEBUG = (() => {
  let timestamp = () => {};
  timestamp.toString = () => {
    return "[DEBUG " + new Date().toLocaleString() + "]";
  };
  return {
    log: console.log.bind(console, "%s", timestamp),
  };
})();

class GeneralRepository {
  static instance;
  // instance = this.constructor.instance;
  // _this;
  #currentDbLocal;
  instanceUUID;
  /**
   *
   * @param {import("nedb")} currentDb
   * @returns
   */
  constructor(currentDb) {
    // if (this.instance) {
    //   return this.instance;
    // }
    // this.instance = this;
    DEBUG.log("GeneralRepository constructor");
    // if (instance) return instance;
    // this.instance = this;
    // this._this = this;
    this.instanceUUID = uuidv4();
    this.#currentDbLocal = currentDb;
  }
  getInstanceUUID() {
    return this.instanceUUID;
  }
  save(body) {
    DEBUG.log("GeneralRepository save body", body);
    const root = this;
    return new Promise(function (resolve, reject) {
      root.#currentDbLocal.insert(body, (err, doc) => {
        if (!err) {
          resolve(doc);
        } else {
          reject(err);
        }
      });
    });
  }

  /**
   *
   * @param {string} id id to update
   * @param {*} body
   * @returns
   */
  update(id, body) {
    DEBUG.log("GeneralRepository update body", body);
    const root = this;
    return new Promise(function (resolve, reject) {
      root.#currentDbLocal.update({ _id: id }, { $set: body }, (err, doc) => {
        if (!err) resolve(doc);
      });
    });
  }

  /**
   *
   * @param {number} tmdbId
   * @returns
   */
  findOneByTmdbId(tmdbId) {
    let root = this;
    return new Promise(function (resolve, reject) {
      DEBUG.log("GeneralRepository findOneByTmdbId", tmdbId);
      root.#currentDbLocal.findOne({ tmdbId: parseInt(tmdbId, 10) }, function (err, doc) {
        if (!err) {
          DEBUG.log("played found", doc);
          if (doc) {
            doc = root.convertToFEWatched(doc);
            resolve(doc);
          } else {
            resolve(err);
          }
        } else {
          DEBUG.log(err);
        }
      });
    });
  }
  /**
   *
   * @param {*} query
   * @returns
   */
  findOneById(query) {
    let root = this;
    return new Promise(function (resolve, reject) {
      DEBUG.log("GeneralRepository findOnebyid", query);
      root.#currentDbLocal.findOne(query, function (err, doc) {
        if (!err) {
          DEBUG.log("played found", doc);
          if (doc) {
            doc = root.convertToFEWatched(doc);
            resolve(doc);
          } else {
            resolve(err);
          }
        } else {
          DEBUG.log(err);
        }
      });
    });
  }

  /**
   * Gets watched movies in list.
   * @param {any[]} idList list of id
   * @returns {Promise<any[]>} list of watched movies
   */
  getInList(idList) {
    console.log("getInList idList: ", idList);
    const root = this;
    return new Promise(function (resolve, reject) {
      root.#currentDbLocal.find({ tmdbId: { $in: idList } }, function (err, docs) {
        if (!err) {
          let toList = [];
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
  var u = "",
    i = 0;
  while (i++ < 36) {
    var c = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"[i - 1],
      r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    u += c == "-" || c == "4" ? c : v.toString(16);
  }
  return u;
}

module.exports = { GeneralRepository };
