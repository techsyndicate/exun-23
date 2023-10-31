const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };
const nonReqString = { type: String, required: false };

const journalSchema = new Schema({
    name: reqString,
    email: reqString,
    heading: reqString,
    text: reqString,
    date: reqString
})

module.exports = mongoose.model("Journal", journalSchema)