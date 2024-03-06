const path = require("path");
const FileType = require("file-type");
const imagekit = require(path.join(
  __dirname,
  "..",
  "config",
  "imagekitConfig"
));
const Video = require(path.join(__dirname, "..", "model", "video"));

const createVideo = async (req, res, next) => {
  await FileType.fromBuffer(req.files.video.data)
    .then((fileType) => {
      if (!fileType) {
        req.errorMessage = "Cannot read file type - file may be corrupted";
      } else if (!fileType.mime.startsWith("video/")) {
        req.errorMessage = "File not video - file format may not be supported";
      }
    })
    .catch((err) => {
      console.error(err);
    });

  if (!req.errorMessage) {
    await imagekit
      .upload({
        file: req.files.video.data,
        fileName: req.files.video.name,
      })
      .then(async (response) => {
        await Video.create({
          fileId: response.fileId,
          name: response.name,
          url: response.url,
        });
      })
      .catch((err) => {
        req.errorMessage = err.message;
      });
  }

  next();
};

module.exports = { createVideo };
