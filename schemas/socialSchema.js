const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reqString = { type: String, required: true, default: "" };
const nonReqString = { type: String, required: false, default: "" };

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
    },
    imglink: nonReqString
})


module.exports = mongoose.model("Social", socialSchema)