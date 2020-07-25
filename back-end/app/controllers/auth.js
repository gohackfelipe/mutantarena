const router = require("express").Router();
const authService = require("../services/auth");
const winston = require("winston");
const Http = require("../helper").Http;
const HttpStatus = require("http-status-codes");

router.post("/register", function (req, res) {
    console.log("registering an user");
    console.log(req.body);
    authService
        .register(req.body)
        .then(T => {
            console.log(T);
            Http.success(res, T);
        })
        .catch(err => {
            if (err) { console.log(err); Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 2, "it was not possible to register."); }
        });
});

router.post("/authenticate", function (req, res) {
    authService.login(req.body).then((result) => {
        console.log("#####");
        console.log(result);
        Http.formatResponse(res, HttpStatus.OK, result);
    }).catch((err) => {
        console.log("#####");
        console.log(err);
        Http.formatResponse(res, HttpStatus.UNAUTHORIZED, err);
    });
});

router.post("/validate", function (req, res) {
    let validate = authService.validate(req.body.token, function (err, result) {
        if (err) res.send(err.message);
        res.send(result);
    });
});

module.exports = router;
