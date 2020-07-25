const winston = require("winston");
const appRoot = require("app-root-path");

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

// define the custom settings for each transport (file, console)

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

var options = {
    file: {
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        json: false,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        format: combine(
            label({ label: 'mutantarena-runner' }),
            timestamp(),
            myFormat
        )
    },
    console: {
        handleExceptions: true,
        json: false,
        colorize: true,
        format: combine(
            label({ label: 'mutantarena-runner' }),
            timestamp(),
            myFormat
        )
    }
};

// instantiate a new Winston Logger with the settings defined above
var logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false // do not exit on handled exceptions
});

module.exports = logger;