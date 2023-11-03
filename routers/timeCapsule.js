const router = require('express').Router();
const request = require('request');
const User = require('../schemas/userSchema')
const capsuleSchema = require('../schemas/capsuleSchema');
const chatSchema = require('../schemas/chatSchema');
const socialSchema = require('../schemas/socialSchema');
const journalSchema = require('../schemas/journalSchema');

router.get('/', async (req, res) => {
    res.render('timeCapsule');
});

router.post('/', async (req,res) => {
    const {latitude, longitude} = req.body;
    const user = req.user

    const newCapsule = new capsuleSchema({
        name: user.name,
        email: user.email,
        latitude: latitude,
        longitude: longitude
    })

    await newCapsule.save();
    
    const admin = await User.findOne({email: "groverbhavit@gmail.com"})
    var date = new Date();
    var chatDateArr = date.toDateString().split(' ');
    var chatDate = chatDateArr[2] + ' ' + chatDateArr[1] + ' ' + chatDateArr[3];
    if(req.body.publicOrNot === "public") {
        const newChat = new socialSchema({
            name: admin.name,
            text: `ANNOUNCEMENT: Everyone, ${user.name} has made a time capsule at a random location! Be sure to find it at time.`,
            dateAndTime: chatDate,
            caption: "ANNOUNCEMENT",
            email: "groverbhavit@gmail.com"
        });

        await newChat.save()
    } else {
        const newJournal = new journalSchema({
            name: admin.name,
            text: `Hey there, today i made a time capsule and hid my precious things and messages inside it. It was really fun to do so. I also advise others to do it too. Even if it is found by someone else before i reach there next time, i won't be sad, instead i'll be happier as i might have helped someone. Bye`,
            date: chatDate,
            heading: "I made a time capsule!",
            email: "groverbhavit@gmail.com"
        });

        await newJournal.save()
    }

    res.redirect('/timeCapsule')
});

module.exports = router