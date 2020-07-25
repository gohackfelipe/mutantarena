module.exports = {
    region: "us-east-1",
    sqs_apiVersion: "2012-11-05",
    queueURL: "https://sqs.us-east-1.amazonaws.com/321748712661/mutantarena-styker-processing",
    MaxNumberOfMessages: 1,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 20,
    HostService: "https://api.mutantarena.feliperibeiro.dev",
    // HostService: "http://localhost:3000",
    bypassMutation: false,
    dirTempName: "./mutants"
}