const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };
const nonReqString = { type: String, required: false };

const userSchema = new Schema({
    name: reqString,
    email: reqString,
    password: reqString,
    issued: {
        type: Boolean,
        required: true,
        default: false
    },
    issuedTime: {
        type: String,
        default: "",
        required: false
    },
    returnTime: {
        type: String,
        default: "",
        required: false
    }
})

module.exports = mongoose.model("User", userSchema)