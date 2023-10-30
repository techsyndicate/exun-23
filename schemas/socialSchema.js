const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };
const nonReqString = { type: String, required: false };

const socialSchema = new Schema({
    email: reqString,
    caption: reqString,
    text: reqString,
    dateAndTime: {
        type: Date,
        default: Date.now(),
        required: true
    },
    comments: {
        type: Array,
        required: true,
        default: []
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model("Social", socialSchema)