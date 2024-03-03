const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require(path.join(__dirname, "config", "mongoConnect"));
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require(path.join(__dirname, "routes", "root")));

app.all("*", (req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(require(path.join(__dirname, "middleware", "errorHandler.js")));

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
