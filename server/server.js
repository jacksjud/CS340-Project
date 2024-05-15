const fs = require('fs/promises');
const path = require('path');
const handlebars = require("handlebars")
const hb_adapter = require('express-handlebars');
const express = require('express')
const connection = require('mysql')
var db = require('./db-connector')

require('dotenv').config()

const host = process.env.HOST
const user = process.env.USER
const sqlpass = process.env.MYSQLPASS
const database = process.env.DB

// Create the express server
var app = express()
var port = process.env.PORT || 3000 // PORT

// Use the static middleware and don't serve directory index files
app.use(express.static('static', { index: false }))

// Use handlebars
app.engine('handlebars', hb_adapter.engine({ defaultLayout: "main" }))   // sets up template engine (handlebars)
app.set('view engine', 'handlebars')            // sets up view engine 
app.set('views', './views')                     // registers where templates are

// Potential function for queries - prototype
async function queryConnection(some, table){
    const connection = mysql.createConnection({
        host: host,
        user: user,
        password: sqlpass,
        database: database
      });
      
    connection.query('SELECT * FROM '+table, (error, results, fields) => {
    if (error) throw error;
    console.log('results: ', results);
    });
    
    connection.end();
}

app.get("/", function(req, res) {
    res.render('body', {

    })
})

app.get("/edit/:table", function(req, res) {
    console.log("param name being passed: ",  req.params.table)
    res.render( 'editor', { 
        body: req.params.table
    })
})


app.get('*', function (req, res) {
    res.render('404')
})

// Listen on port
app.listen(port, function () {
    console.log("== Server is listening on port", port)
})


