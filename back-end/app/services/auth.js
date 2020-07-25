const request = require("request");
const config = require("../../config/config");

global.fetch = require("node-fetch");
global.navigator = () => null;

const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const poolData = config.cognito;

const pool_region = "us-east-1";
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

exports.register = function (body) {
    return new Promise((resolve, reject) => {

        let attributeList = [];

        attributeList.push(
            new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: "name",
                Value: body.username
            })
        );

        userPool.signUp(body.email, body.password, attributeList, null, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};


exports.login = function (body) {
    return new Promise((resolve, reject) => {

        var username = body.username;
        var password = body.password;
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password
        });
        var userData = {
            Username: username,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                var accesstoken = result.getAccessToken().getJwtToken();
                console.log("JWT");
                console.log(accesstoken);
                resolve(result);
            },
            onFailure: function (err) {
                console.log(err);
                reject(err);
            },
            newPasswordRequired: function (userAttributes, requiredAttributes) { }
        });
    });
}

exports.validate = function (token, callback) {
    request(
        {
            url: `https://cognitoidp.${pool_region}.amazonaws.com/${
                poolData.UserPoolId
                }/.well-known/jwks.json`,
            json: true
        },
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                pems = {};
                var keys = body["keys"];
                for (var i = 0; i < keys.length; i++) {
                    var key_id = keys[i].kid;
                    var modulus = keys[i].n;
                    var exponent = keys[i].e;
                    var key_type = keys[i].kty;
                    var jwk = { kty: key_type, n: modulus, e: exponent };
                    var pem = jwkToPem(jwk);
                    pems[key_id] = pem;
                }
                var decodedJwt = jwt.decode(token, { complete: true });
                if (!decodedJwt) {
                    console.log("Not a valid JWT token");
                    callback(new Error("Not a valid JWT token"));
                }
                var kid = decodedJwt.header.kid;
                var pem = pems[kid];
                if (!pem) {
                    console.log("Invalid token");
                    callback(new Error("Invalid token"));
                }
                jwt.verify(token, pem, function (err, payload) {
                    if (err) {
                        console.log("Invalid Token.");
                        callback(new Error("Invalid token"));
                    } else {
                        console.log("Valid Token.");
                        callback(null, "Valid token");
                    }
                });
            } else {
                console.log("Error! Unable to download JWKs");
                callback(error);
            }
        }
    );
};
