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
  try {
    const fileType = await FileType.fromBuffer(req.files.video.data);

    if (!fileType) {
      throw new Error("Cannot read file type - file may be corrupted");
    } else if (!fileType.mime.startsWith("video/")) {
      throw new Error("File not video - file format may not be supported");
    }

    const imagekitResponse = await imagekit.upload({
      file: req.files.video.data,
      fileName: req.files.video.name,
    });

    await Video.create({
      fileId: imagekitResponse.fileId,
      name: imagekitResponse.name,
      url: imagekitResponse.url,
    });
  } catch (err) {
    req.errorMessage = err.message;
  }

  next();
};

const getRandomVideo = async () => {
  return (
    (await Video.aggregate().sample(1))[0] ?? {
      url: "https://ik.imagekit.io/jhzvdjpgg/spinner.gif",
    }
  );
};

module.exports = { createVideo, getRandomVideo };
