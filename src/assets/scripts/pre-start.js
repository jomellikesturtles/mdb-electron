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

  // procPreStart = window.fork(
  //   path.join(__dirname, "src/assets/scripts/pre-start.js"),
  //   null,
  //   {
  //     cwd: __dirname,
  //     silent: false,
  //   }
  // );
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
          let internetDate = new Date(responseDateTime);

          let endDate = new Date();
          endDate.setFullYear(2023);
          endDate.setMonth(0);
          endDate.setDate(1);
          endDate.setHours(0);
          endDate.setMinutes(0);
          endDate.setSeconds(0);
          endDate.setMilliseconds(0);

          const isTrialOk = endDate > internetDate;
          DEBUG.log("istrialOk", isTrialOk);
          resolve(isTrialOk);
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

function checkFiles() {}

// 'checking internet connection...',
// 'checking trial...',
// 'checking disk space...',

async function init() {
  process.send("checking internet connection...");
  // process.send(["checking", "internet-connection"]);
  const isAPIGood = await checkAPIConnection();
  if (!isAPIGood) {
    process.exit(1);
  }
  process.send("checking trial...");
  // process.send(["checking", "trial"]);
  const isTrialGood = await checkTrial();
  if (!isTrialGood) {
    process.exit(1);
  } else {
    DEBUG.log("trial Good");
  }
  process.send("checking existing files and disk space...");
  // process.send(["checking", "disk-space"]);
  checkDiskSpace();
  checkFiles();
  process.exit(0);
}
DEBUG.log("initializing pre-start...");
init();
