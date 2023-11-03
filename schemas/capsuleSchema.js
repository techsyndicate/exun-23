const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };
const nonReqString = { type: String, required: false };

const capsuleSchema = new Schema({
    name: reqString,
    email: reqString,
    latitude: reqString,
    longitude: reqString
})

module.exports = mongoose.model("Capsule", capsuleSchema)