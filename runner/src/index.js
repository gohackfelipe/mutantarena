const AWS = require('aws-sdk');
const config = require('../config');
const winston = require('./logger');
const StrykerCli = require('./striker');
const request = require('request');
const _ = require('lodash');
const file = require('./file');
const uuidv1 = require('uuid/v4');
const async = require('async');
const queueURL = config.queueURL;


winston.info(`Initializing client receiving messages from ${queueURL}`);

file.createDirectory(config.dirTempName);

const configStrykerGenerator = function (files) {
    let json = {
        mutator: "javascript",
        packageManager: "npm",
        // logLevel : 'debug',
        // fileLogLevel: 'debug',
        files: [`${files.baseDir}/*.js`],
        mutate: [
            `${files.app}`
        ],
        // reporters: ["html", "clear-text", "progress"],
        reporters: ["event-recorder", "html"],
        htmlReporter: {
            baseDir: `${files.report.html}`
        },
        eventReporter: {
            baseDir: `${files.report.event}`
        },
        testRunner: "mocha",
        transpilers: [],
        testFramework: "mocha",
        coverageAnalysis: "perTest",
        maxConcurrentTestRunners: 1,
        mochaOptions: {
            spec: [`${files.test}`]
            // asyncOnly: false,
        }
    }
    return `module.exports = function (config) {config.set(${JSON.stringify(json)});};`
}

const fileNameGenerator = function (generator) {
    const uuid = generator();
    return {
        baseDir: `${config.dirTempName}/${uuid}`,
        app: `${config.dirTempName}/${uuid}/app.js`,
        test: `${config.dirTempName}/${uuid}/test.js`,
        stryker: `${config.dirTempName}/${uuid}/${uuid}.stryker.js`,
        report: {
            event: `${config.dirTempName}/${uuid}/report/mutation/event`,
            html: `${config.dirTempName}/${uuid}/report/mutation/html`
        }
    }
}

AWS.config.update({ region: config.region });
var sqs = new AWS.SQS({
    apiVersion: config.apiVersion,
    accessKeyId: "AKIAUV2NXXTK4DTVC6FA",
    secretAccessKey: "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"
});

var params = {
    AttributeNames: [
        "SentTimestamp"
    ],
    MaxNumberOfMessages: config.MaxNumberOfMessages,
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: queueURL,
    VisibilityTimeout: config.VisibilityTimeout,
    WaitTimeSeconds: config.WaitTimeSeconds
};

const updateRound = (objToUpdate, status) => {
    return new Promise((resolve, reject) => {
        winston.info("updating round");
        winston.info(JSON.stringify(objToUpdate));

        if (!objToUpdate.round) {
            throw new Error("object round is required.");
        }

        let round = objToUpdate.round;

        if (objToUpdate.mutants)
            round.mutants = objToUpdate.mutants;
        if (objToUpdate.report)
            round.report = objToUpdate.report;

        round.status = status;

        request.put({
            url: `${config.HostService}/round`,
            json: true,
            body: round
        }, async (err, response, body) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            if (response.statusCode === 200) {
                winston.info('round was updated');
                resolve({ response: response, body: body });
            }
        });
    });
}

const updateArena = (arena) => {
    return new Promise((resolve, reject) => {
        winston.info("updating arena");

        if (!arena) {
            throw new Error("object round is required.");
        }

        request.put({
            url: `${config.HostService}/arena`,
            json: true,
            body: arena
        }, async (err, response, body) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            if (response.statusCode === 200) {
                winston.info('arena was updated');
                resolve({ response: response, body: body });
            }
        });
    });
}

const removeFromQueue = (message) => {
    return new Promise((resolve, reject) => {
        winston.info('removing message from queue');
        sqs.deleteMessage({
            QueueUrl: queueURL,
            ReceiptHandle: message
        }, function (err, data) {
            if (err) {
                reject(err);
            } else {
                winston.info('message from queue deleted');
                resolve(data);
            }
        });
    });
}

async.forever((next) => {
    console.log("Loading data from SQS");
    sqs.receiveMessage(params, async (err, dataSQS) => {
        if (err) {
            winston.error('an error happen: ', err);
        } else if (dataSQS.Messages) {

            winston.log(dataSQS.Messages);
            let __messageSQS = _.head(dataSQS.Messages);
            if (!__messageSQS.Body) {
                winston.error("no object from SQS found");
                return;
            }
            const body = JSON.parse(__messageSQS.Body);
            if (body.test) {
                createMutants(__messageSQS);
                next();
            }
        } //dataSQS.Messages
    });
    setTimeout(next, 20 * 1000);
}, (err) => {
    console.error(err);
});


const createMutants = async (__messageSQS) => {
    const body = JSON.parse(__messageSQS.Body);
    let test = body.test;
    let files = fileNameGenerator(uuidv1);
    winston.info('the files will be generated at ', files);
    let configStryker = configStrykerGenerator(files);
    file.createDirectory(files.baseDir);
    if (!config.bypassMutation) {
        try {
            let response = { round: test };
            await file.create(files.app, test.arena.sourceToMutate);
            await file.create(files.test, test.testCaseCode);
            await file.create(files.stryker, configStryker);

            let __cli = new StrykerCli(["", "", "run"], files.stryker);
            let mutants = await __cli.run();
            if (!test.first) {
                winston.info(`Initializing processing to round ${test._id || ''} - user: ${test.user || ''}`);
                if (mutants) response.mutants = mutants;
                if (mutants) {
                    let report = await file.read(`${files.report.html}/bind-mutation-test-report.js`);
                    response.report = report;
                }
                await updateRound(response, "OK");
            } else {

                let mutants = await file.read(`${files.report.event}/00004-onAllMutantsMatchedWithTests.json`);
                let arena = {
                    _id: test.arena._id,
                    mutants: { status: "OK", data: JSON.parse(mutants) }
                }
                await updateArena(arena);
            }
            file.deleteDirectory(files.baseDir);
            await removeFromQueue(__messageSQS.ReceiptHandle);
        } catch (error) {
            if (error) {
                file.deleteDirectory(files.baseDir);
                await removeFromQueue(__messageSQS.ReceiptHandle);
                if (!test.first) {
                    updateRound({
                        mutants: { error: error.message },
                        round: test
                    }, "ERR");
                } else {
                    let arena = {
                        _id: test.arena._id,
                        mutants: { status: "ERR", message: error.message }
                    }
                    await updateArena(arena);
                }
                winston.error(error);
            }
        }
    }
}