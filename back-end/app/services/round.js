const Round = require("../models/round");
const Arena = require("../models/arena");
const _ = require('lodash');
const sendMessageToJOB = require('../services/mutantjob');
const winston = require('winston');
const config = require('../../config/config');

const getLastRound = (query) => {
    return new Promise((resolve, reject) => {
        let where = {};
        if (query) {
            let { user, arena } = query;
            if (user) where["user"] = user;
            if (arena) where["arena"] = arena;
        }
        Round.findOne(where).sort({ dateCreated: 'desc' }).then(data => {
            if (data) {
                resolve(data);
                return;
            }
            if (!data) {
                Arena.findById(arena).then(__arena => {

                    let value = {
                        status: 'INI',
                        mutants: _.map(__arena.mutants, I => {
                            return {
                                status: 100,
                                mutatorName: I.mutatorName,
                                mutatedLines: I.replacement,
                                id: I.id
                            }
                        })
                    }
                    resolve(value);
                }).catch(err => {
                    reject(err);
                });
            }
        }).catch(err => {
            reject(err);
        });
    });
}

const allRounds = (query) => {
    return new Promise((resolve, reject) => {
        let where = {};
        if (query) {
            let { user, arena } = query;
            if (user) where["user"] = user;
            if (arena) where["arena"] = arena;
        }
        Round.find(where).sort({ dateCreated: 'asc' }).then(data => {
            if (data) {
                resolve(data);
                return;
            }
        }).catch(err => {
            reject(err);
        });
    });
}

const saveRound = (data) => {
    return new Promise((resolve, reject) => {
        let json = data;
        json.status = "QUEUE";

        console.log('saving round');
        console.log(data);

        let newRound = new Round(json);
        newRound.save(function (err, round) {
            if (err) {
                winston.error(err);
                reject(err);
                return;
            }
            Arena.findById(json.arena, async (err, arena) => {
                if (err) {
                    winston.error(err);
                    reject(err);
                    return;
                }
                if (config.activeSendMessageToSQS) {
                    let _sent = await sendMessageToJOB.mutantToRound(round, arena);
                    resolve(_sent);
                }
            });
        });
    });
}

module.exports = {
    getLastRound: getLastRound,
    allRounds: allRounds,
    saveRound: saveRound
}
