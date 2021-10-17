let moment = require("moment"),
  request = require("request");

let DEBUG = (() => {
  let timestamp = () => {};
  timestamp.toString = () => {
    return "[DEBUG " + new Date().toISOString() + "]";
  };
  return {
    log: console.log.bind(console, "%s", timestamp),
  };
})();

function checkDiskSpace() {
  DEBUG.log("checking diskSpace");
}

/**
 *
 */
async function checkTrial() {
  DEBUG.log("checking trial");
  return new Promise(function (resolve, reject) {
    request(
      "http://worldtimeapi.org/api/timezone/Asia/Manila",
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const responseBody = JSON.parse(response.body);
          let responseDateTime = responseBody.datetime;
          let dateTime = new Date(responseDateTime);
          resolve(dateTime.getFullYear() <= 2023 && dateTime.getMonth() <= 0 && dateTime.getDate() <= 1);
        } else {
          DEBUG.log("error");
          reject(error);
        }
      }
    );
  });
}

/**
 *
 */
async function checkAPIConnection() {
  DEBUG.log("checking internet connection");
  return new Promise(function (resolve) {
    require("dns").resolve("www.google.com", function (err) {
      if (err) {
        DEBUG.log("No connection");
        resolve(false);
      } else {
        DEBUG.log("Connected");
        resolve(true);
      }
    });
  });
}

// 'checking disk space...',
// 'checking trial...',
// 'checking internet connection...',

async function init() {
  const isAPIGood = await checkAPIConnection();
  if (!isAPIGood) {
    return;
  }
  const isTrialGood = await checkTrial();
  if(!isTrialGood) {
    return;
  }
  checkDiskSpace();
}
init();
