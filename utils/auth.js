const passport = require('passport')

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    else res.redirect('/login');
  }

function forwardAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    else{
      res.redirect('/issueBook')
    } 
  }


async function loginUser(req, res, next) {
    const errors = []
    console.log(req.body.email, req.body.password)
    await passport.authenticate('local', (err, user, info) => {
      console.log(err, user, info)
      if (err) throw err;
      if (!user) {
        errors.push({ msg: info.message });
        res.render('login', {errors})
      } else {
        req.logIn(user, (err) => {
          if (err) throw err;
          // res.send([{ msg: "Successfully Authenticated", sucess: true }]);
          res.redirect('/profile')
        });
      }})(req, res, next);
  }


module.exports = { ensureAuthenticated, forwardAuthenticated, loginUser };