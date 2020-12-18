require("dotenv").config();

const express = require("express");
const app = express();
const towerRoute = require("./routes/towers");
const sanitize = require("mongo-sanitize");
const path = require("path");

const mongoose = require("mongoose");

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/${process.env.DB_DATABASE}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

app.use(express.json());

app.use((req, res, next) => {
  sanitize(req.body);
  sanitize(req.params);
  next();
});

app.use("/api/towers", towerRoute);

app.use(express.static(path.join(__dirname, "../build")));

app.use(function (error, req, res, next) {
  if (error) {
    console.log(error);
    res.status(500).send({ error: "Server error" });
  }
});

module.exports = app;
