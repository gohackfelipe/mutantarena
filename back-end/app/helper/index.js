const HttpStatus = require("http-status-codes");
const winston = require("winston");
const _ = require("lodash");
const moment = require("moment");

// TODO : Refactoring this class.
class Http {
    static error(res, httpStatusCodeError, internalCodeError, message) {
        const returnValue = {
            error: {
                code: internalCodeError,
                data: message,
                time: moment()
                    .utc()
                    .unix()
            }
        };
        winston.debug(returnValue);
        res.status(httpStatusCodeError).json(returnValue);
    }

    static success(res, json) {
        const returnValue = {
            success: {
                code: HttpStatus.OK,
                data: json,
                time: moment()
                    .utc()
                    .unix()
            }
        };

        if (_.isArray(json)) {
            returnValue.success.total = json && json.length > 0 ? json.length : 0;
        }
        winston.debug(returnValue);
        res.status(HttpStatus.OK).json(returnValue);
    }

    static formatResponse(res, httpStatusCode, json) {
        const returnValue = {
            code: httpStatusCode,
            data: json,
            time: moment()
                .utc()
                .unix()
        };

        if (_.isArray(json)) {
            returnValue.success.total = json && json.length > 0 ? json.length : 0;
        }
        winston.debug(returnValue);
        res.status(HttpStatus.OK).json(returnValue);
    }
}

module.exports = {
    Http: Http
};
