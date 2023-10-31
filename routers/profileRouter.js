const Router = require('express').Router()
const User = require('../schemas/userSchema')
const bcrypt = require('bcrypt')

Router.get("/", async (req, res) => {
    res.render('profile', {user: req.user})
})

Router.get("/edit", async (req, res) => {
    res.render('profileEdit', {user: req.user, errors: []});
});

Router.post("/edit", async (req, res) => {
    const errors = []
    var isPasswordChanging = true
    const {name, email, password, cnfpassword} = req.body
    if (!name || !email || !password || !cnfpassword) {
        errors.push({msg: "Please enter all the credentials"})
    }
    if (!password && !cnfpassword) {
        isPasswordChanging = false
    }
    if (password != cnfpassword) {
        errors.push({msg: "The passwords do not match"})
    }
    if (isPasswordChanging) {
        await User.findOneAndUpdate({email: req.user.email}, {
            $set: {
                name: name,
                email: email,
                password: await bcrypt.hash(password, 10)
            }
        })
    } else {
        await User.findOneAndUpdate({email: req.user.email}, {
            $set: {
                name: name,
                email: email
            }
        })
    }
    if (errors.length > 0) {
        return res.render('profileEdit', {user: req.user, errors: errors})
    }
    
    res.redirect('/profile')
})


module.exports = Router;