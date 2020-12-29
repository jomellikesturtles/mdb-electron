// /*jshint esversion: 6 */
// // !UNUSED
// const fs = require("fs");
// const path = require("path");
// const subtitle = require("subtitle");
// const { parse, resync, stringify } = subtitle;
// const args = process.argv.slice(2);
// const filePath = args[0];
// const fileBaseName = path.basename(filePath);
// const destinationPath = path.join(
//   __dirname,
//   "../subtitles/",
//   fileBaseName + ".vtt"
// );
// fs.createReadStream(filePath)
//   .pipe(parse())
//   .pipe(resync(0)) // negative advance, positive late
//   .pipe(stringify({ format: "WebVTT" }))
//   .pipe(fs.createWriteStream(destinationPath));

// process.send(["destination-path", destinationPath]);
