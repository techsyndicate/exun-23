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
      res.redirect('/dashboard')
    } 
  }


async function loginUser(req, res, next) {
    console.log(req.body.email, req.body.password)
    await passport.authenticate('local', (err, user, info) => {
      console.log(err, user, info)
      if (err) throw err;
      if (!user) res.send([{ msg: info.message }]);
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          // res.send([{ msg: "Successfully Authenticated", sucess: true }]);
          res.redirect('/dashboard')
        });
      }
    })(req, res, next);
  }


module.exports = { ensureAuthenticated, forwardAuthenticated, loginUser };