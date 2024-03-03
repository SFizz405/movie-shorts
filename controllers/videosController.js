const mongoose = require("mongoose");
const { Readable } = require("stream");

const createVideo = (req, res, next) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
  const stream = Readable.from(req.files.video.data);

  stream.pipe(bucket.openUploadStream(req.files.video.name));
  stream.on("end", () => {
    console.log("Upload successful!");
  });

  next();
};

module.exports = { createVideo };
