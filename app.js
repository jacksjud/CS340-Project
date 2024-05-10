// Group: 95
// Team Members:
// Gabriele Falchini
// Judah Jackson

/*
    SETUP
*/
const os = require('os');
const hostname = os.hostname();

var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 8108;                 // Set a port number at the top so it's easy to change in the future


// Database
var db = require('./database/db-connector');

// Handlebars :{
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


/*
    ROUTES
*/
app.get('/', function(req, res){
        res.render('index');                                // Note the call to render() and not send(). Using render() ensures the templating engine
})

app.get('/edit/investors', function (req, res) {
    let query1 = "SELECT * FROM Investors;";               // Define our query
    db.pool.query(query1, function(error, rows, fields){   // Execute the query
        res.render('partials/investors', {data: rows});    // Render the /partials/stocks.hbs file, and also send the renderer
        console.log({data: rows});
    })                                                     // an object where 'data' is equal to the 'rows' we
})

app.get('/edit/stocks', function (req, res) { 
    let query2 = "SELECT * FROM Stocks;";
    db.pool.query(query2, function(error, rows, fields){
        res.render('partials/stocks', {data: rows});
    })
})

app.get('/edit/changes', function (req, res) {
    let query3 = "SELECT * FROM Changes;";
    db.pool.query(query3, function(error, rows, fields){
        res.render('partials/changes', {data: rows});
    })
})

app.get('/edit/investments', function (req, res) {
    let query4 = "SELECT * FROM Investments;";
    db.pool.query(query4, function(error, rows, fields){
        res.render('partials/investments');

    })
})

app.get('/edit/investedStocks', function (req, res) {
    let query5 = "SELECT * FROM InvestedStocks;";
    db.pool.query(query5, function(error, rows, fields){
        res.render('partials/investedStocks');
    })
})

// Catch-all other routes
app.get('*', function (req, res) {
    res.render('404');
})


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://'+ hostname +':' + PORT + '; press Ctrl-C to terminate.');
});