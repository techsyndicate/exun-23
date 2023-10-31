const Router = require('express').Router()
const Journal = require('../schemas/journalSchema.js')

Router.get("/", async (req, res) => {
    res.render('journal');
});

Router.get('/view/:id', async (req, res) => {
    const {id} = req.params
    const myJournal = await Journal.findById(id)
    if (!myJournal) return res.redirect('/journal')
    console.log(myJournal)
    res.render('indi_journal', {myJournal})
})

Router.get('/view', async (req, res) => {
    const myJournals = await Journal.find({email: req.user.email})
    console.log(myJournals)
    res.render('view_journals', {myJournals})
})

Router.post("/", async (req, res) => {
    const {heading, text} = req.body;
    const date = new Date()
    var chatDateArr = date.toDateString().split(' ');
    var dateDone = chatDateArr[2] + ' ' + chatDateArr[1] + ' ' + chatDateArr[3];
    const newJournal = new Journal({
        heading: heading,
        text: text,
        name: req.user.name,
        email: req.user.email,
        date: dateDone
    })
    await newJournal.save()
    console.log(newJournal)
    res.redirect(`/journal/view/${newJournal.id}`)
})


module.exports = Router;