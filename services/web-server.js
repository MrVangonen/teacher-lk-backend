const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
var cors = require('cors');
const webServerConfig = require("../config/web-server.js");
const router = require("./router.js");

let httpServer;

function initialize() {
    return new Promise((resolve, reject) => {
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        httpServer = http.createServer(app);

        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
            res.header(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            );
            next();
        });
        app.use(morgan("combined"));
        
        app.get('/', (req, res) => {
            res.send('All routes start with "/api"')
        })
        // Mount the router at /api so all its routes start with /api
        app.use("/api", router);

        httpServer
            .listen(webServerConfig.port)
            .on("listening", () => {
                console.log(
                    `Web server listening on localhost:${webServerConfig.port}`
                );

                resolve();
            })
            .on("error", err => {
                reject(err);
            });
    });
}

module.exports.initialize = initialize;

function close() {
    return new Promise((resolve, reject) => {
        httpServer.close(err => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}

module.exports.close = close;