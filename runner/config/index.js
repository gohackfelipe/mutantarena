module.exports = {
    region: "us-east-1",
    sqs_apiVersion: "2012-11-05",
    queueURL: "",
    MaxNumberOfMessages: 1,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 20,
    // HostService: "https://api.mutantarena.feliperibeiro.dev",
    HostService: "http://mutant-backend:3000",
    bypassMutation: false,
    dirTempName: "./mutants"
}