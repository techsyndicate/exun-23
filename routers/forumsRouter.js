const router = require('express').Router();
const Chat = require('../schemas/chatSchema');
const { forwardAuthenticated } = require('../utils/auth');


router.get('/', async (req, res) => {
    const reqChats = await Chat.find({});
    console.log(reqChats)
    res.render('forums', {reqChats})
});

router.get('/post', async (req, res) => {
    res.render('create_forum')
})


router.post('/post', async (req, res) => {
    const user = req.user,
          text = req.body.text,
          name = user.name,
          heading = req.body.heading

    const date = new Date();
    var chatDateArr = date.toDateString().split(' ');
    var chatDate = chatDateArr[2] + ' ' + chatDateArr[1] + ' ' + chatDateArr[3];
    
    const newChat = new Chat({
        name: name,
        text: text,
        date: chatDate,
        heading: heading,
        email: user.email
    })

    console.log(newChat)
    await newChat.save()
    res.redirect('/forums')
});

router.get('/:id', async (req, res) => {
    const myCurrentForum = await Chat.findById(req.params.id)
    res.render('view_forum', {forum: myCurrentForum})
})

router.post('/reply/:id', async (req, res) => {
    const {reply} = req.body
    const foundForum = await Chat.findById(req.params.id)
    const currentReplies = foundForum.replies
    const date = new Date();
    var chatDateArr = date.toDateString().split(' ');
    var chatDate = chatDateArr[2] + ' ' + chatDateArr[1] + ' ' + chatDateArr[3];
    const replyObj = {
        email: req.user.email,
        name: req.user.name,
        reply: reply,
        date: chatDate
    }
    currentReplies.push(replyObj)
    
    await Chat.findByIdAndUpdate(req.params.id, {
        $set: {
            replies: currentReplies
        }
    })
    res.redirect('/forums/' + req.params.id)
})

// router.get('/random/:id', async (req, res) => {
//     await Chat.findByIdAndUpdate(req.params.id, {
//         $set: {
//             replies: []
//         }
//     })
// })

module.exports = router;