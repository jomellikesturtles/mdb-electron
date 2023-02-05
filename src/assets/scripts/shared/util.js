// IPC Main utils.
/*jshint esversion: 6 */
const path = require("path");
/**
 * Fancy console log
 */
let DEBUG = (() => {
  let timestamp = () => {};
  timestamp.toString = () => {
    return "" + new Date().toISOString() + "] ";
    // return `[${type} ` + new Date().toISOString() + "] ";
  };
  return {
    log: console.log.bind(console, "%s", "[DEBUG", timestamp.toString()),
    error: console.error.bind(console, "%s", "[ERROR", timestamp.toString())
  };
})();

/**
 *  Common function to init process.
 * @param {import ("process") } process;
 */
let processInit = (process) => {
  // process.send =
  //   process.send ||
  //   function (...args) {
  //     DEBUG.log("SIMULATING process.send", ...args);
  //   };

  process.on("uncaughtException", function (error) {
    DEBUG.log(process.pid, "uncaughtException ERROR: ", error.message);
    process.send("uncaughtException");
    process.send(["uncaughtException", error.message]);
    DEBUG.log(process.pid, "uncaughtException ERROR: ", error.stack);
    // DEBUG.log(process.pid, "uncaughtException ERROR: ", error.name);
  });

  process.on("unhandledRejection", function (error) {
    DEBUG.log(process.pid, "unhandledRejection ERROR: ", error);
    process.send(["unhandledRejection", error.message]);
  });

  process.on("beforeExit", function (error) {
    DEBUG.log(process.pid, "beforeExit...", error);
    process.send(["operation-failed", "general"]);
  });

  process.on("warning", function (error) {
    DEBUG.log(process.pid, "warning...", error);
    process.send(["warning", "general"]);
  });

  process.on("exit", function (error) {
    DEBUG.log(process.pid, "exit: ", error);
  });

  process.on("disconnect", function (error) {
    DEBUG.log(process.pid, "disconnect: ", error);
  });
};

/**
 * Common function to init process.
 * @param {import ("process") } process;
 */
let processSend = (process, message, args) => {
  DEBUG.log("Sending process message:", message, "; args: ", args);
  process.send =
    process.send ||
    function (...args) {
      DEBUG.log("SIMULATING process.send", ...args);
    };

  // process.send([message, args]) ||
  //   function (...args) {
  //     DEBUG.log("SIMULATING process.send", ...args);
  //   };
  process.send([message, args]);
};

const sayHello = function () {
  // processSend(process, IPCMainChannel.);
  // IPCMainChannel.
  console.log("hell");
  console.log(path.join(__dirname, "..", "db", "bookmarks.db"));
};

let getReleaseYear = function (releaseDate) {
  const STRING_REGEX_OMDB_RELEASE_DATE = `^(\\d{2})+\\s+([a-z]{3,})+\\s+(\\d{4})+`;
  const STRING_REGEX_TMDB_RELEASE_DATE = `([0-9]{2,4})-([0-9]{2})-([0-9]{2})`;
  const STRING_REGEX_YEAR_ONLY = `^([0-9]{2,4})$`;
  const REGEX_OMDB_RELEASE_DATE_LOCAL = new RegExp(STRING_REGEX_OMDB_RELEASE_DATE, `gi`);
  const REGEX_TMDB_RELEASE_DATE_LOCAL = new RegExp(STRING_REGEX_TMDB_RELEASE_DATE, `gi`);
  const REGEX_YEAR_ONLY = new RegExp(STRING_REGEX_YEAR_ONLY, `gi`);
  const result1 = REGEX_OMDB_RELEASE_DATE_LOCAL.exec(releaseDate);
  const result2 = REGEX_TMDB_RELEASE_DATE_LOCAL.exec(releaseDate);
  let toReturn = "";
  if (result1) {
    toReturn = releaseDate.substr(releaseDate.lastIndexOf(" ") + 1);
  } else if (result2) {
    toReturn = releaseDate.substring(0, releaseDate.indexOf("-"));
  } else if (REGEX_YEAR_ONLY.exec(releaseDate)) {
    toReturn = releaseDate;
  }
  return toReturn;
};

/**
 * Checks if script is running under nodeJS
 */
function isNode() {
  if (typeof window === "undefined") {
    console.log("window undefined");
  } else {
    console.log("window not undefined");
  }
  if (typeof process === "object") {
    console.log("process object");
  } else {
    console.log("process not object");
  }
}

// Human readable bytes util
function prettyBytes(num) {
  var exponent,
    unit,
    neg = num < 0,
    units = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  if (neg) num = -num;
  if (num < 1) return (neg ? "-" : "") + num + " B";
  exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1);
  num = Number((num / Math.pow(1000, exponent)).toFixed(2));
  unit = units[exponent];
  return (neg ? "-" : "") + num + " " + unit;
}

/**
 *
 * @param {string} text
 * @returns
 */
function regexify(text) {
  text = text.trim().replace(/(\s+)/g, " ");
  const words = text.split(" ");
  let final = "";
  words.forEach((item) => {
    final += "(" + escapeRegExp(item) + ")[.\\s-_=;,]?";
  });
  return final;
}

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&");
}

function getNumberOfPages(count, size) {
  let totalPages = count / size;
  const modulo = count % size;
  if (modulo > 0 && totalPages > 0) totalPages++;
  return Math.floor(totalPages);
}

/**
 * Gets current function name.
 * @returns function name
 */
function getFuncName() {
  return "[Function: " + getFuncName.caller.name + "]";
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
module.exports = {
  sayHello,
  getReleaseYear,
  prettyBytes,
  regexify,
  getNumberOfPages,
  getFuncName,
  DEBUG,
  processInit,
  processSend,
  uuidv4
};
// export default uuidv4;
