const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  fileId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Video", videoSchema);
