const express = require("express");
const config = require("./config/config");
const glob = require("glob");
const mongoose = require("mongoose");
const io = require('./app/events/');
const cors = require('cors')

mongoose.connect(config.db, {
    auth: { authSource: process.env.AUTHSOURCE },
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    useMongoClient: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    connectTimeoutMS: 10000,
}).then(() => console.log("MongoDB is connected..")).catch((err) => console.error(err));

// const db = mongoose.connection;
// db.on("error", () => {
//     throw new Error("unable to connect to database at " + config.db);
// });

const models = glob.sync(config.root + "/app/models/*.js");
models.forEach(function (model) {
    require(model);
});

const app = express();

app.use(cors())

module.exports = require("./config/express")(app, config);

var server = require('http').createServer(app);

server.listen(config.port);
server.on('listening', () => {
    console.log("Express server listening on port " + config.port);
});

io(server);
