const router = require("express").Router();
// const authService = require("../services/auth");
// const winston = require("winston");
const Arena = require("../models/arena");
const Http = require("../helper").Http;
const HttpStatus = require("http-status-codes");
const sendMessageToJOB = require('../services/mutantjob');
const config = require('../../config/config');

router.get("/", function (req, res) {
    const type = req.query.q;
    Arena.find().then(data => {
        let values;
        switch (type) {
            case 'filter':
                values = data.filter((arena) => {
                    return arena.mutants.data && arena.mutants.data.length > 0;
                });
                break;
            case 'all':
                values = data;
                break;
            default:
                values = data;
                break;
        }
        Http.success(res, values);
    }).catch(err => {
        if (err) Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 1, "it was not possible to get arena.");
    });
});

router.get("/:id", function (req, res) {
    let id = req.params.id;
    Arena.findById(id).then(data => {
        Http.success(res, data);
    }).catch(err => {
        if (err) Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 1, "it was not possible to get arena.");
    });
});

router.post("/", function (req, res) {
    let json = req.body;
    console.log(json);
    if (!json.name || !json.description || !json.sourceToMutate) {
        Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 2, "parameters required not informed : name, description, sourceToMutate");
        return;
    }
    json.mutants = {
        status: "QUEUE",
        data: []
    }
    let arena = new Arena(json);

    arena.save(async function (err, data) {
        if (err) { Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 3, "it was not possible arena the config."); return; };

        if (config.activeSendMessageToSQS)
            await sendMessageToJOB.mutantToArena(arena);

        Http.success(res, data);
    });
});

router.put("/", function (req, res) {
    let json = req.body;
    if (!json._id) {
        Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 4, "parameters required not informed : _id");
        return;
    }
    // const newData = {
    //     name: json.name,
    //     description: json.description
    // }
    Arena.findByIdAndUpdate(json._id, json, function (err, data) {
        if (err) Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 5, "it was not possible arena the config.");
        Http.success(res, data);
    });
});

router.delete("/:id", async function (req, res) {
    let id = req.params.id;
    if (!id) {
        Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 4, "parameters required not informed : _id");
        return;
    }
    Arena.deleteOne({ _id: id }).then((data) => {
        Http.success(res, { ok: true });
    }).catch((err) => {
        Http.success(res, { ok: false });
    });
});

module.exports = router;
