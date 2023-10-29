const Router = require('express').Router()

Router.get("/", async (req, res) => {
    res.render('index');
});


module.exports = Router;