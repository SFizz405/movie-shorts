const express = require("express");
const fileUpload = require("express-fileupload");
const router = express.Router();
const path = require("path");
const Video = require(path.join(__dirname, "..", "model", "video"));
const { createVideo } = require(path.join(
  __dirname,
  "..",
  "controllers",
  "videosController"
));

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router
  .route("/upload(.html)?")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "upload.html"));
  })
  .post(fileUpload(), createVideo, (req, res) => {
    if (!req.errorMessage) {
      res.redirect("/view");
    } else {
      res.send(req.errorMessage);
    }
  });

router.get("/view(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "view.html"));
});

router.get("/getRandomVideo", async (req, res) => {
  res.send((await Video.find({}))[0].url);
});

module.exports = router;
