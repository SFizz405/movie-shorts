const express = require("express");

const fs = require("fs");
const { Transform } = require("stream");

const fileUpload = require("express-fileupload");
const router = express.Router();
const path = require("path");
const { createVideo } = require(path.join(
  __dirname,
  "..",
  "controllers",
  "videosController"
));

const Video = require(path.join(__dirname, "..", "model", "video"));

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router
  .route("/upload(.html)?")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "upload.html"));
  })
  .post(fileUpload(), createVideo, async (req, res) => {
    if (!req.errorMessage) {
      const obj = await Video.find({});
      const URL = obj[0].url;

      const replacementTransform = new Transform();
      replacementTransform._transform = function (data, encoding, done) {
        const str = data.toString().replace("URL", URL);
        this.push(str);
        done();
      };

      res.write("<!-- Begin stream -->\n");
      let stream = fs.createReadStream(
        path.join(__dirname, "..", "views", "view.html")
      );
      stream
        .pipe(replacementTransform)
        .on("end", () => {
          res.write("\n<!-- End stream -->");
        })
        .pipe(res);
    } else {
      res.send(req.errorMessage);
    }
  });

router.get("/view(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "view.html"));
});

module.exports = router;
