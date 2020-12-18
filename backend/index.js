const http = require("http");
const app = require("./app");
const WebSocket = require("ws");

let server = http.createServer(app);

server.listen(process.env.PORT, () =>
  console.log("Express running on port " + process.env.PORT)
);

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
    } catch {}
  });
});
