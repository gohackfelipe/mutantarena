const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Arena = new Schema({
    name: String,
    description: String,
    sourceToMutate: String,
    dateCreated: { type: Date, default: Date.now },
    status: { type: Boolean, default: true },
    mutants: Object
});

module.exports = mongoose.model("Arena", Arena);
