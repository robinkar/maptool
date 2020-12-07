require('dotenv').config()

const express = require("express");
const app = express();
const towerRoute = require("./routes/towers");
const sanitize = require("mongo-sanitize");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");

app.use(
  "/api",
  express.json(),
  (req, res, next) => {
    req.body = sanitize(req.body);
    req.params = sanitize(req.params);
    next();
  },
  towerRoute
);

app.use(express.static(path.join(__dirname, "../build")));

app.use(express.static("public"));

app.use(function (error, req, res, next) {
  if (error) {
    console.log(error);
    res.status(500).send({ error: "Server error" });
  }
});

let server = http.createServer(app);

server.listen(process.env.PORT, () => console.log("Express running on port " + process.env.PORT));

const wss = new WebSocket.Server({
  server: server,
});

wss.on("connection", function (ws, request) {
  ws.on("message", function (msgString) {
    try {
      const msg = JSON.parse(msgString);
      switch (msg.action) {
        case "NEW_TOWER":
          wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ action: "REFRESH_TOWERS" }));
            }
          });
          break;
        case "DELETE_TOWER":
          wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ action: "REFRESH_TOWERS" }));
            }
          });
          break;
        case "UPDATE_TOWER":
          wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ action: "REFRESH_TOWERS" }));
            }
          });
          break;
        default:
          break;
      }
    } catch { }
  });
});
