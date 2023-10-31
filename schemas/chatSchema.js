const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };
const nonReqString = { type: String, required: false };

const chatSchema = new Schema({
    email: reqString,
    name: reqString,
    heading: reqString,
    text: reqString,
    date: reqString,
    replies: {
        type: Array,
        required: true,
        default: []
    }
})

module.exports = mongoose.model("Chat", chatSchema)