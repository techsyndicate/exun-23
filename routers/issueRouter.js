const router = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const User = require('../schemas/userSchema')
const DOMAIN = process.env.CONSTANT_DOMAIN + '/issueBook';
const {sendMail} = require('../utils/mailHelper')
const ejs = require('ejs');


// 1) If return, then give it to the next person in the waitlist
// 2) Add charge (paisa) to waitlist and make it a bit more so that it is not unfair for normal users.


router.get('/', async (req,res) => {
  const user = req.user,
        book = await User.findOne({book: "nuxEland"});

  const users = await User.find({})
  var canIssue = true;
  for (var i = 0; i < users.length; i++) {
    if (users[i].issued) {
      if (users[i].email === user.email) {
        canIssue = true
      }
      else {
        canIssue = false;
      }
    }
  }
  console.log(users)
  const waitlist = book.waitlist;
  var nameInWaitlist = false;

  for (let i = 0; i < waitlist.length; i++) {
    if (user.email === waitlist[i]) {
      nameInWaitlist = true;
    }
  }
  // console.log(book.waitlist)
  // for (var i = 0; i < book.length)
  res.render('issueBook', {user, waitlist, canIssue, nameInWaitlist});
});

router.post('/return', async (req,res) => {
  await User.updateOne({email: req.user.email}, {$set: {issued: false, issuedTime: "", returnTime: ""}})
  const book = await User.findOne({book: "nuxEland"})

  const waitlist = book.waitlist
  var date =  new Date()
  const date2 = new Date()
  date2.setDate(date2.getDate() + 7);
  var issueDate;
    issueDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
    var returnDate = (date2.getDate()) + '/' + (date2.getMonth() + 1) + '/' + date2.getFullYear()
  if (waitlist[0]) {
    const reqEmail = waitlist[0]
    await User.updateOne({email: reqEmail}, {
      $set: {
        issued: true,
        issuedTime: issueDate,
        returnTime: returnDate
      }  
    });
    var waitlist_users = []
    for (var i = 0; i < waitlist.length; i++) {
      if (waitlist[i] !== reqEmail){
        waitlist_users.push(waitlist[i]);
      } else {
        continue;
      }
    }
    await User.updateOne({book: "nuxEland"}, {
      $set: {
        waitlist: waitlist_users
      }
    });
    const user = req.user
    await sendMail(req.user.email, 'Book Issued', 'Book Issued', null)
    console.log("removed from waitlist automatically",waitlist_users)
  }
  res.redirect('/issueBook')
});

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
    await sendMail(req.user.email, 'Book Issued', 'Book Issued', null)
    await User.updateOne({email: req.user.email}, {$set: {issued: true, issuedTime: issueDate, returnTime: returnDate}})
    res.redirect(303, session.url);
  });

router.get('/success', async (req,res) => {
  const user = req.user
  // console.log(typeof user.issuedTime)
  res.render('success', {user})
});

router.post('/removewaitlist', async (req, res) => {
  const user = req.user,
        book = await User.findOne({book: "nuxEland"}),
        waitlist = book.waitlist,
        email = user.email;

  var waitlist_users = []
  for (var i = 0; i < waitlist.length; i++) {
    if (waitlist[i] !== email){
      waitlist_users.push(waitlist[i]);
    } else {
      continue;
    }
  }

  await User.updateOne({book: "nuxEland"}, {
    $set: {
      waitlist: waitlist_users
    }
  });

  console.log("removed",waitlist_users)
  await sendMail(req.user.email, 'Removed from Waitlist', 'You were removed from the Waitlist and your money has been sent back to your account', null)

  res.redirect('/issueBook')
});

router.get('/success_waitlist', (req, res) => {
  res.render('success_waitlist', {user: req.user})
})

router.post('/waitlist', async (req,res) => {
  const user = req.user,
        book = await User.findOne({book: "nuxEland"}),
        waitlist = book.waitlist,
        email = user.email;

        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price: process.env.PRICE_ID_2,
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${DOMAIN}/success_waitlist`,
          cancel_url: `${DOMAIN}/`,
        });
        await sendMail(req.user.email, 'Added to Waitlist', 'Added to Waitlist', null)
        var newWaitlist = waitlist
        
        newWaitlist.push(email)
        console.log("added",newWaitlist)
        await User.updateOne({book: "nuxEland"}, {
          $set: {
            waitlist: newWaitlist 
          }
        })
      
  // console.log(book);
  res.redirect(303, session.url);
});

module.exports = router;
