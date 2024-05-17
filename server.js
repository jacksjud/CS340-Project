// Group: 95
// Team Members:
// Gabriele Falchini
// Judah Jackson

/*
    SETUP
*/
// Get local hostname for URL
const os = require('os');
const hostname = os.hostname();

// Favicon
const favicon = require('serve-favicon');
const path = require('path');

// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 8108;                 // Set a port number at the top so it's easy to change in the future

// Handlebars :{
const { engine } = require('express-handlebars');
///app.engine('.hbs', engine({defaultLayout: "main" }))    // Sets up template engine (.hbs instead of handlebars)
app.engine('.hbs', engine({extname: ".hbs"}));          // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                         // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector');
const dbTablePKs = {
    "Investors":"investorID",
    "Stocks":"stockID",
    "Changes":"changeID",
    "Investments": "investID",
    "InvestedStocks": "investedStockID"
}

//***SECURITY WARNING***
const DEBUG = false;         //DEBUG -- Should always be set to false for production version
                             //         gives additional error output to website (renders errors in .json)


// Function
function formatData(results){
    return results.map(row => {
        // Extract data from each row
        const data = {};
        for (const key in row) {
            if (row.hasOwnProperty(key)) {
                const capKey = key.charAt(0).toUpperCase() + key.slice(1);
                data[capKey] = row[key];
            }
        }
        return data;
    });
}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the correct MIME type for CSS files
app.use('*.css', (req, res, next) => {
    res.header('Content-Type', 'text/css');
    next();
});

// Set the correct MIME type for JavaScript files
app.use('*.js', (req, res, next) => {
    res.header('Content-Type', 'application/javascript');
    next();
});

// Serve the favicon
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));


/*
    ROUTES
*/

// Display index page
app.get('/', function(req, res){
        res.render('index'); // Note the call to render() and not send(). Using render() ensures the templating engine
})

// Display editor page
app.get('/edit', function(req, res){
    res.render('editor');
})

// Display only pages with their corresponding data
app.get("/show/:table", function(req, res) {
    const tableName = req.params.table;
    const table = tableName.charAt(0).toUpperCase() + tableName.slice(1);
    const querySelect = `SELECT * FROM ${table};`
    db.pool.query(querySelect, (error, results, fields) => {
        if(error){
            if(DEBUG == true){ // Make sure debug is set to true
                res.json({ status: false, error: 'Error showing table' });
                return; // So errors don't crash the server
            } else {
                res.render('404');
            } // Always print error to terminal
            console.error('Error showing table:', error);
        } else {
            if(results.length === 0){
                res.render('partials/showTables', {
                    title: table
                });
            } else {
                const newObjects = formatData(results);

                res.render('partials/showTables', {
                    title: table,
                    attributes: Object.keys(newObjects[0]),
                    inputs: Object.values(newObjects)
                });
            }
        }
    });
})

// Display pages, that can be edited, with their corresponding data. *different from just pages showing data*
app.get('/edit/investors', async function (req, res) {
    let query1 = "SELECT * FROM Investors;";               // Define our query
    db.pool.query(query1, function(error, rows, fields){   // Execute the query
        res.render('partials/investors', {data: rows});    // Render the /partials/stocks.hbs file, and also send the renderer
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


// Delete data in row of corresponding page
app.get('/delete/row', function(req, res) {
    const { table, row } = req.query;
    console.log("table, row: ", table, row);

    // Disable foreign key checks
    db.pool.query('SET foreign_key_checks = 0', function(error) {
        if (error) {
            if(DEBUG == true){ // Make sure debug is set to true
                res.json({ status: false, error: 'Error disabling foreign key checks' });
            } else {
                res.render('404');
            } // Always print error to terminal
            console.error('Error disabling foreign key checks:', error);
            return; // So errors don't crash the server
        }

        // Perform the DELETE operation
        const queryDelete = `DELETE FROM ${table} WHERE ${dbTablePKs[table]} = ${row}`;
        db.pool.query(queryDelete, function(error, fields) {
            // Re-enable foreign key checks
            db.pool.query('SET foreign_key_checks = 1', function(err) {
                if (err) {
                    if(DEBUG == true){ // Make sure debug is set to true
                        res.json({ status: false, error: 'Error enabling foreign key checks' });
                    } else {
                        res.render('404');
                    } // Always print error to terminal
                console.error('Error enabling foreign key checks:', error);
                return; // So errors don't crash the server
                }
                if (error) {
                    if(DEBUG == true){ // Make sure debug is set to true
                        res.json({ status: false, error: 'Error deleting row' });
                    } else { // Only print error to terminal
                        console.error('Error deleting row:', error);
                        res.render('404');
                    }
                } else {
                    res.json({ status: true });
                }
            });
        });
    });
});


// Catch-all other routes not defined
app.get('*', function (req, res) {
    res.render('404');
})



/*
    LISTENER
*/
app.listen(PORT, function(){    // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://'+ hostname +':' + PORT + ' press Ctrl-C to terminate.');
});