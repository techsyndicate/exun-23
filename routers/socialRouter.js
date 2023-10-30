const router = require('express').Router()
const Social = require('../schemas/socialSchema.js')

router.get('/', (req, res) => {
    res.render('social')
})

router.get('/post', (req, res) => {
    res.render('socialPost')
})

router.get('/post/:id', async (req, res) => {
    const reqSocial = await Social.findById(req.params.id)
    if (!reqSocial) {
        return res.send("Not Found");
    } else {
        res.render('user_post', {reqSocial})
    }
})

router.post('/post', async (req, res) => {
    const {caption, text} = req.body
    const email = req.user.email
    const newPost = new Social({text, caption, email})
    await newPost.save()
    res.redirect("/social/post/" + newPost.id)
})

router.post('/post/:id/comment', async (req, res) => {
    const requiredPost = await Social.findById(req.params.id)
    const {comment} = req.body
    const email = req.user.email
    const originalComments = requiredPost.comments
    console.log(originalComments)
    const date = new Date();
    var chatDateArr = date.toDateString().split(' ');
    var chatDate = chatDateArr[2] + ' ' + chatDateArr[1] + ' ' + chatDateArr[3];
    const commentObj = {
        comment: comment,
        email: email,
        timeStamp: chatDate
    }
    originalComments.push(commentObj)
    console.log(originalComments)
    await Social.findOneAndUpdate({_id: req.params.id}, {
        $set: {
            comments: originalComments
        }
    })
    console.log("DONE")
    res.redirect('/social/post/' + req.params.id)
})

module.exports = router