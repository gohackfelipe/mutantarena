const router = require("express").Router();
const authService = require("../services/auth");
const winston = require("winston");
const Round = require("../models/round");
const Arena = require("../models/arena");
const Http = require("../helper").Http;
const HttpStatus = require("http-status-codes");
const sendMessageToJOB = require('../services/mutantjob');
const config = require('../../config/config');


router.get("/", function (req, res) {
    let where = {};
    if (req.query) {
        let { user, arena } = req.query;
        if (user) where["user"] = user;
        if (arena) where["arena"] = arena;
    }
    Round.find(where).then(data => {
        Http.success(res, data);
    }).catch(err => {
        if (err) Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 1, "it was not possible to get history.");
    });
});

router.get("/:id", function (req, res) {
    let id = req.params.id;
    Round.findById(id).then(data => {
        Http.success(res, data);
    }).catch(err => {
        if (err) Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 1, "it was not possible to get round by id.");
    });
});

router.post("/queue", function (req, res) {
    let json = req.body;
    json.status = "QUEUE";
    if (!json.testCaseCode || !json.user || !json.arena) {
        Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 2, "parameters required not informed : testCaseCode, user");
        return;
    }
    let newRound = new Round(req.body);
    newRound.save(function (err, round) {
        if (err) Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 3, "it was not possible save the round.");
        Arena.findById(json.arena, async (err, arena) => {
            if (err) {
                winston.error(err);
                return;
            }
            if (config.activeSendMessageToSQS)
                await sendMessageToJOB.mutantToRound(round, arena);
        });
        Http.success(res, round);
    });
});

router.put("/", (req, res) => {

    let json = req.body;
    console.log(json)
    if (!json.mutants || !json.arena) {
        Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 3, "parameters required not informed : mutants, arena, user");
        return;
    }

    //TODO: Validar se id existe
    Round.findByIdAndUpdate(json._id, json, function (err, data) {
        if (err) Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 5, "an error ocurred trying to update an user");
        Http.success(res, data);
    });
});
module.exports = router;
