const fs = require('fs/promises');
const path = require('path');
const handlebars = require("handlebars")
const hb_adapter = require('express-handlebars');
const express = require('express')
const connection = require('mysql')

require('dotenv').config()

// Create the express server
var app = express()
var port = process.env.PORT || 3000 // PORT

// Use the static middleware and don't serve directory index files
app.use(express.static('static', { index: false }))

// Use handlebars
app.engine('handlebars', hb_adapter.engine({ defaultLayout: "main" }))   // sets up template engine (handlebars)
app.set('view engine', 'handlebars')            // sets up view engine 
app.set('views', './views')                     // registers where templates are

app.get("/", function(req, res) {
    res.render('body', {

    })
})

app.get("/investors", function(req, res) {
    res.render('investors', {

    })
})

app.get("/stocks", function(req, res) {
    res.render('stocks', {

    })
})

app.get("/changes", function(req, res) {
    res.render('/lists/changes.handlebars', {

    })
})


app.get("/investments", function(req, res) {
    res.render('investments', {

    })
})

app.get("/investedStocks", function(req, res) {
    res.render('investments', {

    })
})

app.get('*', function (req, res) {
    res.render('404')
})

// Listen on port
app.listen(port, function () {
    console.log("== Server is listening on port", port)
})


