const fs = require("fs");
const rimraf = require('rimraf');
const _ = require('lodash');
const winston = require('./logger');

let read = async (path) => {
    if (!path) throw new Error("file path was not found");
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf8", function (err, contents) {
            if (err) reject(err);
            resolve(contents);
        });
    });
};

let create = (fileName, content) => {
    if (!fileName) throw new Error(`filename ${fileName} was not found`);
    if (!content) throw new Error("the content to write was not found");
    return new Promise((resolve, reject) => {
        fs.appendFile(fileName, content, function (err) {
            if (err) reject(err);
            resolve(true);
        });
    });
};

let __delete = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        winston.info(`the file - ${filePath} - was deleted`);
    }
}

let deleteDirectory = (dir) => {
    winston.info('deleting temp dir');
    if (fs.existsSync(dir)) {
        rimraf(dir, function () { winston.info(`The directory - ${dir} - was deleted.`); });
    }
}

let createDirectory = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

module.exports = {
    read: read,
    create: create,
    __delete: __delete,
    deleteDirectory: deleteDirectory,
    createDirectory: createDirectory
}