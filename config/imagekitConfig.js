const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.imagekitPublicKey,
  privateKey: process.env.imagekitPrivateKey,
  urlEndpoint: "https://ik.imagekit.io/jhzvdjpgg/",
});

module.exports = imagekit;
