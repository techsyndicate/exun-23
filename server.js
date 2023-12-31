require('dotenv').config()
// packages
const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    path = require('path'),
    cors = require('cors'),
    ejs = require('ejs'),
    session = require('cookie-session'),
    passport = require('passport'),
    passportInit = require('./utils/passportConfig.js'),
    flash = require('express-flash'),
    {ensureAuthenticated, forwardAuthenticated} = require('./utils/auth.js')
    
// routers
const indexRouter = require('./routers/indexRouter'),
    loginRouter = require('./routers/loginRouter'),
    regRouter = require('./routers/regRouter.js'),
    issueRouter = require('./routers/issueRouter.js'),
    forumsRouter = require('./routers/forumsRouter.js'),
    socialRouter = require('./routers/socialRouter.js'),
    journalRouter = require('./routers/journalRouter.js'),
    profileRouter = require('./routers/profileRouter.js'),
    emergencyRouter = require('./routers/emergencyRouter.js'),
    timeCapsule = require('./routers/timeCapsule.js')

const app = express(),
    PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }), express.urlencoded({ extended: true, limit: '1mb' }))
app.use(flash())
app.use('/', express.static('public'));



// passport stuff
passportInit(passport)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}))

app.use(passport.initialize())
app.use(passport.session())


// Mongoose connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Mongo Connected");
})
.catch((e) => {
    console.log(e);
})


// routing
app.use('/', indexRouter)
app.use('/register', regRouter)
app.use('/login', forwardAuthenticated, loginRouter)
app.use('/issueBook', ensureAuthenticated, issueRouter)
app.use('/forums', ensureAuthenticated, forumsRouter)
app.use('/social', ensureAuthenticated, socialRouter)
app.use('/journal', ensureAuthenticated, journalRouter)
app.use('/profile', ensureAuthenticated, profileRouter)
app.use('/emergency', ensureAuthenticated, emergencyRouter)
app.use('/timeCapsule', ensureAuthenticated, timeCapsule)


// testing
// app.get('/', (req, res) => {
//     res.send("Hello World");
// })

// starting port
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});