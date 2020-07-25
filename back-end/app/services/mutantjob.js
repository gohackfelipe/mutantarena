var AWS = require('aws-sdk');
var config = require("../../config/config");

AWS.config.update({ region: config.sqs.region });

var sqs = new AWS.SQS({
    apiVersion: config.sqs.apiVersion,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

const sendMessage = (message) => {

    return new Promise((resolve, reject) => {

        var params = {
            DelaySeconds: config.sqs.DelaySeconds,
            MessageBody: JSON.stringify(message),
            QueueUrl: config.sqs.queueURL
        };

        sqs.sendMessage(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

const mutantToArena = (arena) => {
    return new Promise((resolve, reject) => {
        let message = {
            test: {
                arena: {
                    _id: arena._id,
                    sourceToMutate: arena.sourceToMutate
                },
                testCaseCode: "// \n\nmodule.exports={}\n\n",
                first: true
            }
        }
        console.log(message);
        sendMessage(message).then((data) => resolve(data)).catch((err) => reject(err));
    });
}

const mutantToRound = (round, arena) => {
    return new Promise((resolve, reject) => {
        let message = {
            test: {
                _id: round._id,
                testCaseCode: round.testCaseCode,
                first: false,
                arena: {
                    _id: arena._id,
                    sourceToMutate: arena.sourceToMutate
                }
            },
        }
        sendMessage(message).then((data) => resolve(data)).catch((err) => reject(err));
    });
}

module.exports = {
    mutantToArena: mutantToArena,
    mutantToRound: mutantToRound
}
