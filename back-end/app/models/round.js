const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Round = new Schema({
    report: String,
    dateCreated: { type: Date, default: Date.now },
    user: String,
    testCaseCode: String,
    status: String,
    mutants: [],
    arena: { type: mongoose.Schema.Types.ObjectId, ref: "Arena" }
});

module.exports = mongoose.model("Round", Round);
