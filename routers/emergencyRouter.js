const router = require('express').Router();
const User = require('../schemas/userSchema');
const {sendMail} = require('../utils/mailHelper');
const ejs = require('ejs');

router.get('/', async (req, res) => {
    res.render('emergency', {user: req.user})
});

router.post('/:id', async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, {
        $set :{
            emergency: true
        }
    });
    await sendMail('groverbhavit@gmail.com', 'EMERGENCY ISSUED', 'EMERGENCY ISSUED', null)
    res.redirect('/emergency')
});

router.post('/removeEmergency/:id', async (req,res) => {
    await User.findByIdAndUpdate(req.params.id, {
        $set :{
            emergency: false
        }
    });
    
    res.redirect('/emergency')
})

module.exports = router;