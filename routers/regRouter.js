const router = require('express').Router()
const User = require('../schemas/userSchema.js')
const bcrypt = require('bcrypt')
const { forwardAuthenticated } = require('../utils/auth.js')

router.get("/", forwardAuthenticated, (req, res) => {
    res.render('register');
});

router.post("/", forwardAuthenticated, async (req, res) => {
    try {
        const email = req.body.email
        let errors = []
        await User.findOne({ email: email }).then((user) => {
            if (user) {
            errors.push({ msg: "Account already exists, try logging in" })
            }
        })
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        
        await newUser.save();
        console.log(newUser);
        res.redirect('/login');
    } catch (error) {
        console.log(error);
        res.redirect('/register');
    }
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;