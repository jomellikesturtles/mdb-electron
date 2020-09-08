/*jshint esversion: 8 */
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;
var libraryDbService = require("../library-db-service-2.js");

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/test", (req, res) => {
  console.log(`Example app listening on port ${port}!`);
  res.send("Hello Worldd!s");
});

app.get("/ab(cd)?e", function (req, res) {
  res.send("ab(cd)?e");
});
app.get("/ab+cd", function (req, res) {
  res.send("ab+cd");
});
app.get("/ab*cd", function (req, res) {
  res.send("ab*cd");
});

app.get("/getBookmarks", (req, res) => {
  res.send("Hello Worldd!s");
});

/**
 * Gets individual bookmark.
 * @param id the tmdb id or imdb id
 */
app.get("/getBookmark/:id", (req, res) => {
  console.log(req.params);
  const response = {
    tmdbId: 123,
    imdbId: "tt1234567",
    title: "Titanic",
    year: 1997,
  };
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT");
  res.json(response);
});

app.post("/removeBookmark", (req, res) => {
  res.send("Hello Worldd!s");
});

app.post("/addBookmark", (req, res) => {
  res.send("Hello Worldd!s");
});

app.get("/countBookmarks", (req, res) => {
  libraryDbService.count().then(async (count) => {
    console.log(`sending ${count}`);
    res.json(count);
    // res.send(count)
  });
});

// app.get('/getBookmark')

app.get("/getVideoFile", function (req, res) {});

app.get("/stream", function (req, res) {
  // const filePath = path.join(process.cwd(), 'src', 'assets', 'scripts', 'A.Streetcar.Named.Desire.1951.1080p.BluRay.x264-[YTS.AM].mp4')
  const filePath = `D:\\media server\\movies\\Forrest Gump.mp4`;
  console.log("filepath: ", filePath);

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
    process.send(["video-success"]);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    fs.createReadStream(filePath).pipe(res);
    process.send(["video-success"]);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
