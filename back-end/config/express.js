const express = require("express");
const glob = require("glob");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");

const morgan = require("morgan");
const winston = require("winston");
const winstonStream = require("./winston");
const cors = require('cors');

module.exports = (app, config) => {
    const env = process.env.NODE_ENV || "development";
    app.locals.ENV = env;
    app.locals.ENV_DEVELOPMENT = env == "development";

    app.set("views", config.root + "/app/views");
    app.set("view engine", "ejs");

    // app.use(favicon(config.root + '/public/img/favicon.ico'));
    app.use(logger("dev"));
    app.use(bodyParser.json());
    app.use(
        bodyParser.urlencoded({
            extended: true
        })
    );
    app.use(cookieParser());
    app.use(compress());
    app.use(express.static(config.root + "/public"));
    app.use(methodOverride());

    app.use(morgan("combined", { stream: winstonStream.stream }));

    // var controllers = glob.sync(config.root + '../app/controllers/');
    // controllers.forEach((controller) => {
    //   require(controller)(app);
    // });
    const allowedOrigins = ['http://localhost:4200', 'http://localhost:4201', 'https://mutantarena.feliperibeiro.dev', 'https://report.mutantarena.feliperibeiro.dev'];
    app.use(cors({
        credentials: true,
        origin: function (origin, callback) {
            // allow requests with no origin
            // (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg = 'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        }
    }));
    app.use(require("../app/controllers/"));

    app.use((req, res, next) => {
        var err = new Error("Not Found");
        err.status = 404;
        next(err);
    });



    if (app.get("env") === "development") {
        app.use((err, req, res, next) => {
            winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            res.status(err.status || 500);
            res.render("error", {
                message: err.message,
                error: err,
                title: "error"
            });
        });
    }

    app.use((err, req, res, next) => {
        winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: {},
            title: "error"
        });
    });

    return app;
};
