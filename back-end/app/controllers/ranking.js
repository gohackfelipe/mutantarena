const router = require("express").Router();
const Arena = require("../models/arena");
const Http = require("../helper").Http;
const HttpStatus = require("http-status-codes");
const Round = require("../models/round");
const _ = require('lodash');

const reduceMutants = (R) => {
    let __value = 0;
    if (R.status !== 'ERR') {
        __value = R.mutants.reduce((accumulator, value) => {
            if (value.status === 1) {
                return accumulator + 1;
            }
            return accumulator;
        }, 0);
    }
    return __value;
}

router.get("/:id", function (req, res) {
    let id = req.params.id;
    Arena.findById(id).then(__arena => {
        let __response = {
            arena: {
                name: __arena.name,
            }
        }
        Round.find({
            arena: __arena._id
        }).then(__rounds => {
            const rounds = _.chain(__rounds).map((T) => {
                return {
                    _id: T._id,
                    user: T.user,
                    status: T.status,
                    totalMutantsKilled: reduceMutants(T),
                    totalMutants: T.status !== 'ERR' ? T.mutants.length : __arena.mutants.data.length,
                    dateCreated: T.dateCreated
                }
            }).map((T) => {
                T.score = T.totalMutantsKilled * 100 / T.totalMutants;
                return T;
            }).orderBy(['score', 'dateCreated'], ['desc']).uniqBy('user').value();

            __response.rounds = rounds;
            Http.success(res, __response);
        }).catch(err => {
            if (err) Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 2, "it was not possible to get rounds of arena.");
        });
    }).catch(err => {
        if (err) Http.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 1, "it was not possible to get ranking.");
    });
});

module.exports = router;
