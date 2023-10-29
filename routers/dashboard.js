const Router = require('express').Router()

Router.get("/", async (req, res) => {
    res.render('dashboard');
});


module.exports = Router;