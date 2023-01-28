/**
 * General repository
 */

const { uuidv4 } = require("./shared/util");

let DEBUG = (() => {
  let timestamp = () => {};
  timestamp.toString = () => {
    return "[DEBUG " + new Date().toLocaleString() + "]";
  };
  return {
    log: console.log.bind(console, "%s", timestamp)
  };
})();

class GeneralRepository {
  static instance;
  // instance = this.constructor.instance;
  // _this;
  currentDbLocal;
  instanceUUID;

  /**
   *
   * @param {import("nedb")} currentDb
   * @param {string} uniqueFieldName
   * @returns
   */
  constructor(currentDb, uniqueFieldName) {
    // if (this.instance) {
    //   return this.instance;
    // }
    // this.instance = this;
    DEBUG.log("GeneralRepository constructor");
    if (uniqueFieldName)
      currentDb.ensureIndex({ fieldName: uniqueFieldName, unique: true, sparse: true }, function () {});
    // if (instance) return instance;
    // this.instance = this;
    // this._this = this;
    this.instanceUUID = uuidv4();
    this.currentDbLocal = currentDb;
  }
  getInstanceUUID() {
    return this.instanceUUID;
  }
  save(body) {
    DEBUG.log("GeneralRepository save body", body);
    const root = this;
    return new Promise(function (resolve, reject) {
      root.currentDbLocal.insert(body, (err, doc) => {
        if (!err) {
          resolve(doc);
        } else {
          reject(root.handleReject(err));
        }
      });
    });
  }

  /**
   *
   * @param {*} query
   * @param {*} body
   * @returns
   */
  update(query, body) {
    DEBUG.log("GeneralRepository update body", body);
    const root = this;
    return new Promise(function (resolve, reject) {
      root.currentDbLocal.update(
        query,
        { $set: body },
        { upsert: true, returnUpdatedDocs: true },
        (err, numberOfUpdated, isUpsert) => {
          if (!err) {
            DEBUG.log("numberOfUpdated", numberOfUpdated);
            DEBUG.log("isUpsert", isUpsert);
            resolve(numberOfUpdated);
          } else {
            reject(root.handleReject(err));
          }
        }
      );
    });
  }

  /**
   *
   * @param {*} query
   * @returns
   */
  findOne(query) {
    let root = this;
    return new Promise(function (resolve, reject) {
      DEBUG.log("GeneralRepository findOne", query);
      root.currentDbLocal.findOne(query, function (err, doc) {
        if (!err) {
          DEBUG.log("played found", doc);
          if (!err) {
            // doc = root.map(doc);
            resolve(doc);
          }
        } else {
          reject(err);
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
      root.currentDbLocal.find({ tmdbId: { $in: idList } }, function (err, docs) {
        if (!err) {
          let toList = [];
          DEBUG.log("DOCS: ", docs);
          resolve(toList);
        } else {
          reject(root.handleReject(err));
        }
      });
    });
  }

  remove(query) {
    const root = this;
    return new Promise(function (resolve, reject) {
      root.currentDbLocal.remove(query, function (err, n) {
        if (!err) {
          let n = [];
          DEBUG.log("number of deleted: ", n);
          resolve(n);
        } else {
          reject(root.handleReject(err));
        }
      });
    });
  }
  map(arg) {
    return {
      id: arg._id,
      tmdbId: arg.tmdb,
      imdbId: arg.imdb,
      title: arg.title,
      year: arg.yr,
      percentage: arg.pctg
    };
  }
  handleReject(err) {
    DEBUG.log("repository reject", err.errorType);
    return err.errorType;
  }
}

module.exports = { GeneralRepository };
