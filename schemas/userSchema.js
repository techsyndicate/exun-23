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
    createdOn: {
        type: String,
        required: true
    },
    returnTime: {
        type: String,
        default: "",
        required: false
    },
    waitlist: {
        type: Array,
        default: false,
        required: false
    },
    emergency: {
        type: Boolean,
        default: false,
        required: true
    }
})

module.exports = mongoose.model("User", userSchema)