const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };
const nonReqString = { type: String, required: false };

const chatSchema = new Schema({
    name: reqString,
    text: reqString,
    date: reqString,
    time: reqString
})

module.exports = mongoose.model("Chat", chatSchema)