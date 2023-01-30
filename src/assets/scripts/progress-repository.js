/*jshint esversion: 6 */
const { GeneralRepository } = require("./general-repository");
const { DEBUG } = require("./shared/util");
const { playedRepository } = require("./user-media-db");

class ProgressRepository extends GeneralRepository {
  /**
   * Handles autotoggle of played if progress is 99%
   * @param {*} query
   * @param {*} body
   * @returns
   */
  update(query, body) {
    DEBUG.log(`ProgressRepository saving body in ${this.currentDbLocalName}`, body);
    if (isAutoPlayToggle(body)) {
      const customBody = { tmdbId: body.tmdbId };
      playedRepository
        .save(customBody)
        .then((playedResponse) => {
          DEBUG.log(`autoToggled saved to play.db with value ${JSON.stringify(playedResponse)}`);
        })
        .catch((err) => {
          DEBUG.log(`ERR autoToggle to play.db ${err}`);
        });
    }
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

/**
 *
 * @param {*} body
 **/
function isAutoPlayToggle(body) {
  if ((body.current / body.total) * 100 >= 99) {
    return true;
  }
  return false;
}
module.exports = { ProgressRepository };
