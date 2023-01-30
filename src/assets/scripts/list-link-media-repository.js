/*jshint esversion: 6 */
const { GeneralRepository } = require("./general-repository");
const { DEBUG } = require("./shared/util");

class ListLinkMediaRepository extends GeneralRepository {
  /**
   * TODO: handle unique tmdbId and listId
   * @param {Object} body
   * @returns
   */
  save(body) {
    DEBUG.log(`ListLinkMediaRepository saving body in ${this.currentDbLocalName}`, body);
    const root = this;
    return new Promise(function (resolve, reject) {
      root.findOne({ tmdbId: body.tmdbId, listId: body.listId }).then((e) => {
        if (!e) {
          root.currentDbLocal.insert(body, (err, doc) => {
            if (!err) {
              resolve(doc);
            } else {
              reject(root.handleReject(err));
            }
          });
        } else {
          reject("uniqueViolated");
        }
      });
    });
  }
}

module.exports = { ListLinkMediaRepository };
