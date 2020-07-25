const path = require("path");
const rootPath = path.normalize(__dirname + "/..");

const env = process.env.NODE_ENV || "production";

const config = {
    production: {
        root: rootPath,
        app: {
            name: process.env.APP_NAME
        },
        port: process.env.PORT || 3000,
        db: process.env.MONGODB_URI,
        cognito: {
            UserPoolId: process.env.COGNITO_USERPOOL_ID,
            ClientId: process.env.COGNITO_CLIENT_ID
        },
        sqs: {
            region: process.env.SQS_REGION || "us-east-1",
            sqs_apiVersion: process.env.SQS_API_VERSION,
            queueURL: process.env.QUEUE_URL,
            DelaySeconds: process.env.SQS_DELAY,
        },
        activeSendMessageToSQS: process.env.SQS_ACTIVE
    }
};

console.log("loading this config");
console.log(config);

module.exports = config[env];
