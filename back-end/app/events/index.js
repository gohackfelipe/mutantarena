const socketIO = require('socket.io');
const Round = require("../models/round");
const Arena = require("../models/arena");
const _ = require('lodash');
const config = require('../../config/config');
const winston = require('winston');
const sendMessageToJOB = require('../services/mutantjob');

const getMutantsfromArena = function (_idArena) {
    return new Promise((resolve, reject) => {
        Arena.findById(_idArena).then(__arena => {
            let value = {
                status: 'INI',
                mutants: __arena.mutants && __arena.mutants.data ? _.map(__arena.mutants.data, value => {
                    return {
                        status: 100,
                        mutatorName: value.mutatorName,
                        mutatedLines: value.replacement,
                        id: value.id
                    }
                }) : []
            }
            resolve(value);
        }).catch(err => {
            reject(err);
        });
    });
}

const getLastRound = (query) => {
    return new Promise((resolve, reject) => {
        let where = {};
        if (query) {
            const { user, arena } = query;
            if (user) where["user"] = user;
            if (arena) where["arena"] = arena;
        }
        Round.findOne(where).sort({ dateCreated: 'desc' }).then(__data => {

            if (!__data || __data.status === "ERR") {
                getMutantsfromArena(query.arena).then((data => {

                    if (__data.testCaseCode) {
                        data.testCaseCode = __data.testCaseCode;
                    }
                    resolve(data);
                })).catch((err) => {
                    reject(err);
                })
                return;
            }
            resolve(__data);
            return;
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

const socketServer = (server) => {

    const io = socketIO(server, {
        transports: ['polling', 'websocket'],
        allowUpgrades: true
    });

    io.on('connection', function (socket) {
        console.log('user connection');

        socket.on('prepareArena', async function (data) {

            const lastRound = await getLastRound(data);
            socket.emit('lastRound', lastRound);

            const all = await allRounds(data);
            socket.emit('history', all);
        });

        socket.on('allRounds', async function (data) {
            const lastRound = await allRounds(data);
            socket.emit('history', lastRound);
        });

        socket.on('saveRound', async function (data) {

            console.log('teste', data);
            let json = data;
            json.status = "QUEUE";

            let newRound = new Round(json);
            newRound.save(function (err, round) {
                Arena.findById(json.arena, async (err, arena) => {
                    if (err) {
                        winston.error(err);
                        return;
                    }
                    if (config.activeSendMessageToSQS)
                        await sendMessageToJOB.mutantToRound(round, arena);
                });
                // Http.success(res, round);
                const _prepareArena = {
                    user: data.user,
                    arena: data.arena
                }
                socket.emit('prepareArena', _prepareArena);
            });
        });
    });
}

module.exports = socketServer;
