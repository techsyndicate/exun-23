const router = require('express').Router();
const User = require('../schemas/userSchema');
const {sendMail} = require('../utils/mailHelper');
const ejs = require('ejs');
const bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', async (req, res) => {
    res.render('emergency', {user: req.user})
});

router.post('/:id', async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, {
        $set :{
            emergency: true
        }
    });
    console.log(__dirname + "/../views/emergencyMail.ejs")
    await sendMail(process.env.TO_EMAIL_EMERGENCY, "EMERGENCY ISSUED", "EMERGENCY ISSUED", await ejs.renderFile(__dirname + "/../views/emergencyMail.ejs", {user: req.user}))
    await sendMail(req.user.email, "EMERGENCY ISSUED", "EMERGENCY ISSUED", await ejs.renderFile(__dirname + "/../views/userEmergencyMail.ejs", {user: req.user}))
    res.redirect('/emergency')
});

router.post('/removeEmergency/:id', async (req,res) => {
    console.log(__dirname + "/../views/emergencyMail.ejs")
    await User.findByIdAndUpdate(req.params.id, {
        $set :{
            emergency: false
        }
    });
    
    res.redirect('/emergency')
})

module.exports = router;