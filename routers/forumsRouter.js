const router = require('express').Router();
const Chat = require('../schemas/chatSchema');
const { forwardAuthenticated } = require('../utils/auth');


router.get('/', async (req, res) => {
    const reqChats = await Chat.find({});
    console.log(reqChats)
    res.render('forums', {reqChats})
});

router.post('/post', async (req, res) => {
    const user = req.user,
          text = req.body.text,
          name = user.name;
    const date = new Date();
    var chatTime = date.getHours() + ":" + date.getMinutes();
    var chatDateArr = date.toDateString().split(' ');
    var chatDate = chatDateArr[2] + ' ' + chatDateArr[1] + ' ' + chatDateArr[3];
    
    const newChat = new Chat({
        name: name,
        text: text,
        date: chatDate,
        time: chatTime
    })

    // console.log(newChat)
    await newChat.save()
    res.redirect('/forums')
});

module.exports = router;