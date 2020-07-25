module.exports = {
    apps: [{
        name: 'mutantarena-backend',
        script: 'app.js',
        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        // args: 'one two',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            PORT: 3000,
            MONGODB_URI: "mongodb://localhost/mutantarena",
            AUTHSOURCE: "admin",
            MONGO_USER: "mutant",
            MONGO_PASS: "mutant2020!",
            COGNITO_USERPOOL_ID: "us-east-1_KntF46Ssz",
            COGNITO_CLIENT_ID: "36gmolud6nvp4a83aqukherb51",
            SQS_REGION: "us-east-1",
            SQS_API_VERSION: "2012-11-05",
            QUEUE_URL: "https://sqs.us-east-1.amazonaws.com/321748712661/mutantarena-styker-processing",
            SQS_DELAY: 5,
            SQS_ACTIVE: true,
            AWS_ACCESS_KEY: "AKIAUV2NXXTK4DTVC6FA",
            AWS_SECRET_KEY: "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",
            NODE_ENV: "production",
            APP_NAME: "mutant-arena"
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }]
};


