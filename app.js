const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const path = require("path");
const { engine } = require("express-handlebars");
const { wss } = require("./websocket"); // Import wss from the new websocket module
const port = 5050;
require("dotenv").config();

const app = express();
const server = http.createServer(app); // Create HTTP server

// Attach WebSocket server to the HTTP server
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// Body parser middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const viewRoutes = require("./routes/viewRoutes");
const apiRoutes = require("./routes/apiRoutes");

// Setup handlebars engine and views location
const viewsPath = path.join(__dirname, "./templates/views");
const partialsPath = path.join(__dirname, "./templates/partials");
const layoutsPath = path.join(__dirname, "./templates/layouts");

const hbs = engine({
  extname: "hbs", // sets the extension name to .hbs
  defaultLayout: "main", // sets the default layout to main.hbs
  layoutsDir: layoutsPath, // path to layouts folder
  partialsDir: partialsPath, // path to partials folder
  helpers: {
    truncate: function (str, numWords) {
      var words = str.split(" ");
      if (words.length > numWords) {
        words = words.slice(0, numWords);
        return words.join(" ") + "...";
      }
      return str;
    },
    subtract: function (a, b) {
      return a - b;
    },
  },
});

app.engine("hbs", hbs);
app.set("view engine", "hbs");
app.set("views", viewsPath);

// Static files
const publicDirectoryPath = path.join(__dirname, "./public");
app.use(express.static(publicDirectoryPath));

// Mount routes
app.use("/api", apiRoutes); // Includes messageRoutes, healthRoute
app.use(viewRoutes); // Routes for serving HTML pages

server.listen(port, '0.0.0.0', () => {
  console.log(`Qurban Mgmt App listening at http://localhost:${port}`);
});

module.exports = app;
