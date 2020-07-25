const router = require("express").Router();
const authService = require("../services/auth");
const winston = require("winston");
const User = require("../models/user");
const Http = require("../helper").Http;
const HttpStatus = require("http-status-codes");

router.get("/", function (req, res) {
    User.find().then(users => {
        Http.success(res, users);
    }).catch(err => {
        if (err) Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 1, "it was not possible to get the users.");
    });
});

router.post("/", function (req, res) {
    let json = req.body;
    if (!json.email || !json.name || !json.admin) {
        Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 2, "parameters required not informed : email, name, admin");
        return;
    }
    let newUser = new User(req.body);

    newUser.save(function (err, user) {
        if (err) Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 3, "it was not possible save the user.");
        Http.success(res, user);
    });
});

router.put("/:email", function (req, res) {
    let json = req.body;
    let params = req.params;
    if (!params.email) {
        Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 3, "parameters required not informed : email");
        return;
    }

    if (!json.name) {
        Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 4, "parameters required not informed : name");
        return;
    }
    //TODO: Ao atualizar, moongose não retorna objeto atualizado.
    User.findOneAndUpdate({ 'email': params.email }, json, function (err, user) {
        if (err) Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 5, "an error ocurred trying to update an user");
        Http.success(res, user);
    });
});

router.delete("/", function (req, res) {
    let json = req.body;
    if (!json.email) {
        Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 4, "parameters required not informed : name");
        return;
    }
    User.findOne({ 'email': json.email }).then((exist => {
        if (!exist) {
            Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 5, "user to delete not found");
            return;
        }
        User.deleteOne({ 'email': json.email }, function (err) {
            if (err) Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 6, "an error ocurred trying to update an user");
            Http.success(res, []);
        });
    }))
});

module.exports = router;
