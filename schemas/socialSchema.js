const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };
const nonReqString = { type: String, required: false };

const socialSchema = new Schema({
    email: reqString,
    caption: reqString,
    text: reqString,
    dateAndTime: reqString,
    comments: {
        type: Array,
        required: true,
        default: []
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    name: reqString,
    likedBy: {
        type: Array,
        required: true,
        default: []
    }
})


module.exports = mongoose.model("Social", socialSchema)