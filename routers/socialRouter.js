const router = require('express').Router()
const Social = require('../schemas/socialSchema.js')

router.get('/', async (req, res) => {
    const socialChats = await Social.find({});
    console.log(socialChats);
    res.render('social', {socialChats})
})

router.get('/post', (req, res) => {
    res.render('socialPost')
})

router.get('/post/:id', async (req, res) => {
    const user = req.user;
    const reqSocial = await Social.findById(req.params.id)
    var isAdmin = false
    if (req.user.email === reqSocial.email) {
        isAdmin = true
    }
    if (!reqSocial) {
        return res.send("Not Found");
    } else {
        res.render('user_post', {reqSocial, currentUserName: req.user.email, isAdmin: isAdmin, user})
    }
})

router.post('/deletePost/:id', async (req, res) => {
    await Social.findByIdAndDelete(req.params.id);
    res.redirect('/social');
})

router.post('/post', async (req, res) => {
    const {caption, text} = req.body
    const newText = text.replace(/\n/g, '<br>')
    const email = req.user.email
    const name = req.user.name
    const date = new Date();
    var chatDateArr = date.toDateString().split(' ');
    var dateAndTime = chatDateArr[2] + ' ' + chatDateArr[1] + ' ' + chatDateArr[3];
    const newPost = new Social({text: newText, caption, email, dateAndTime, name})
    await newPost.save()
    console.log(newPost)
    res.redirect("/social/post/" + newPost.id)
});

router.post('/post/:id/comment', async (req, res) => {
    const requiredPost = await Social.findById(req.params.id)
    const {comment} = req.body
    const name = req.user.name
    const originalComments = requiredPost.comments
    console.log(originalComments)
    const date = new Date();
    var chatDateArr = date.toDateString().split(' ');
    var chatDate = chatDateArr[2] + ' ' + chatDateArr[1] + ' ' + chatDateArr[3];
    const commentObj = {
        comment: comment,
        name: name,
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
});

router.post('/post/:id/deleteComment/:index', async (req, res) => {
    console.log("1")
    const reqPost = await Social.findById(req.params.id);
    console.log("2")
    const originalComments = reqPost.comments;
    console.log("3")
    const newComments = [];
    console.log("4")
    for (let i = 0; i < originalComments.length; i++) {
        if (i == req.params.index) {
            continue;
        }
        else {
            newComments.push(originalComments[i]);
        }
    }
    console.log(newComments)
    await Social.findOneAndUpdate({_id: req.params.id}, {
        $set: {
            comments: newComments
        }
    });

    res.redirect('/social/post/' + req.params.id);
}); 

router.post('/likePost/:id', async (req, res) => {
    const weirdArr = []
    const {id} = req.params;
    const currentPost = await Social.findById(id)
    if (!currentPost) {
        return res.redirect('/social')
    }
    const originallyLiked = currentPost.likedBy
    if (originallyLiked.includes(req.user.email)) {
        for (let i = 0; i < originallyLiked.length; i++) {
            if (originallyLiked[i] === req.user.email) {
                console.log("Already Liked Dumbass")
            } else {
                weirdArr.push(originallyLiked[i])
            }
        }
        await Social.findOneAndUpdate({_id: req.params.id}, {
            $set: {
                likedBy: weirdArr,
                likes: weirdArr.length
            }
        })
        return res.redirect(`/social/post/${id}`)
    }
    originallyLiked.push(req.user.email)
    await Social.findOneAndUpdate({_id: req.params.id}, {
        $set: {
            likedBy: originallyLiked,
            likes: originallyLiked.length
        }
    })
    console.log(await Social.findById(id));
    res.redirect(`/social/post/${id}`)
})

module.exports = router