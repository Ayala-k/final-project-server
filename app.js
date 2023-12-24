const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
const { routesInit } = require("./api/routes/config_routes")
require("./api/db/mongoconnect");
const cookieParser = require('cookie-parser')

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")))

routesInit(app);

const server = http.createServer(app);

let port = process.env.PORT
server.listen(port);