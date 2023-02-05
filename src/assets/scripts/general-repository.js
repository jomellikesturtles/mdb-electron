/*jshint esversion: 6 */
/**
 * General repository
 */

const { uuidv4, DEBUG } = require("./shared/util");

const path = require("path");
const DataStore = require("nedb");

class GeneralRepository {
  static get instance() {
    return this.instance;
  }
  /**@returns {DataStore} */
  static get currentDbLocal() {
    return this.currentDbLocal;
  }

  /**@returns {string} */
  static get instanceUUID() {
    return this.instanceUUID;
  }

  /**@returns {string} */
  static get currentDbLocalName() {
    return this.currentDbLocalName;
  }

  /**
   *
   * @param {string} dbName
   * @param {string} uniqueFieldName
   * @returns
   */
  constructor(dbName, uniqueFieldName) {
    // if (this.instance) {
    //   return this.instance;
    // }
    // this.instance = this;
    DEBUG.log("Creating repository for", dbName);
    this.currentDbLocalName = dbName;
    let currentDb = new DataStore({
      filename: path.join(process.cwd(), "src", "assets", "db", `${dbName}.db`), // electron
      autoload: true,
      timestampData: true
    });

    if (uniqueFieldName) {
      currentDb.ensureIndex({ fieldName: uniqueFieldName, unique: true, sparse: true }, function () {});
    }

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
    DEBUG.log(`GeneralRepository saving body in ${this.currentDbLocalName}`, body);
    const root = this;
    return new Promise(function (resolve, reject) {
      root.currentDbLocal.insert(body, (err, doc) => {
        if (!err) {
          resolve(doc);
          DEBUG.log(`GeneralRepository saving body doc ${doc}`);
        } else {
          DEBUG.log(`GeneralRepository saving body err ${err}`);
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
    DEBUG.log(`GeneralRepository updating in ${this.currentDbLocalName}`, body);
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
    DEBUG.log(`GeneralRepository findOne in ${root.currentDbLocalName}`, query);
    return new Promise(function (resolve, reject) {
      root.currentDbLocal.findOne(query, function (err, doc) {
        if (!err) {
          DEBUG.log(`${root.currentDbLocalName} found`, doc);
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
   *
   * @param {*} query
   * @returns
   */
  find(query) {
    let root = this;
    DEBUG.log(`GeneralRepository find in ${root.currentDbLocalName}`, query);
    return new Promise(function (resolve, reject) {
      root.currentDbLocal.find(query, function (err, doc) {
        if (!err) {
          DEBUG.log(`${root.currentDbLocalName} found`, doc);
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
   *
   * @param {{query:{any},sort:{any},skip:number,limit:number}} params
   * @returns
   */
  getPaginated(params) {
    let root = this;
    // query.query;
    DEBUG.log(`GeneralRepository getPaginated in ${root.currentDbLocalName}`, params);
    return new Promise(function (resolve, reject) {
      root.currentDbLocal
        .find(params.query)
        .sort(params.sort)
        .skip(params.skip)
        .limit(params.limit)
        .exec(function (err, doc) {
          if (!err) {
            DEBUG.log(`${root.currentDbLocalName} found`, doc);
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
    DEBUG.log(`getInList in ${this.currentDbLocalName} idList: `, idList);
    const root = this;
    return new Promise(function (resolve, reject) {
      root.currentDbLocal.find({ tmdbId: { $in: idList } }, function (err, docs) {
        if (!err) {
          let toList = [];
          DEBUG.log(`in ${root.currentDbLocalName} DOCS: `, docs);
          resolve(docs);
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
          DEBUG.log("number of deleted: ", n);
          resolve(n);
        } else {
          reject(root.handleReject(err));
        }
      });
    });
  }

  count(query) {
    DEBUG.log(`GeneralRepository count int ${this.currentDbLocalName}`);
    const root = this;
    return new Promise(function (resolve, reject) {
      root.currentDbLocal.count(query, (err, doc) => {
        if (!err) {
          resolve(doc);
          DEBUG.log(`GeneralRepository count doc ${doc}`);
        } else {
          DEBUG.log(`GeneralRepository count err ${err}`);
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
    DEBUG.log(`repository reject ${err} ${JSON.stringify(err)} errType ${err.errorType}`);
    return err.errorType;
  }
}

module.exports = { GeneralRepository };
