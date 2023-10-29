const router = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const User = require('../schemas/userSchema')
const DOMAIN = 'http://localhost:3000/issueBook';
const {sendMail} = require('../utils/mailHelper')
const ejs = require('ejs');


router.get('/', async (req,res) => {
  const user = req.user
  res.render('issueBook', {user});
});

router.post('/return', async (req,res) => {
  await User.updateOne({email: req.user.email}, {$set: {issued: false, issuedTime: "", returnTime: ""}})
  res.redirect('/issueBook')
})

router.post('/create-checkout-session', async (req, res) => {
    // const requiredUser = await User.findOne({email: req.user.email})
    const user = req.user
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${DOMAIN}/success`,
      cancel_url: `${DOMAIN}/`,
    });
    const date = new Date()
    const date2 = new Date()
    date2.setDate(date2.getDate() + 7);
    var issueDate;
    issueDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
    var returnDate = (date2.getDate()) + '/' + (date2.getMonth() + 1) + '/' + date2.getFullYear()
    // console.log(finalDate)
    await sendMail('groverbhavit@gmail.com', 'Book Issued', 'Book Issued', await ejs.renderFile(__dirname + "/../views/bookIssuedMail.ejs", {user}))
    await User.updateOne({email: req.user.email}, {$set: {issued: true, issuedTime: issueDate, returnTime: returnDate}})
    res.redirect(303, session.url);
});

router.get('/success', async (req,res) => {
  const user = req.user
  // console.log(typeof user.issuedTime)
  res.render('success', {user})
})

module.exports = router;
