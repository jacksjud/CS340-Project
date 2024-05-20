const fs = require('fs');
const path = require('path');
const handlebars = require("handlebars")
const hb_adapter = require('express-handlebars');
const express = require('express')
const mysql = require('mysql')
const db = require('./database/db-connector');
const quick = require('./database/db-quick');
const { table } = require('console');
require('dotenv').config()

const replacementQueries = require('./replaceData.json')


// Create the express server
var app = express()
var port = process.env.PORT || 3000 // PORT

// Use the static middleware and don't serve directory index files
app.use(express.static('static', { index: false }))

// Use handlebars
app.engine('handlebars', hb_adapter.engine({ defaultLayout: "main" }))   // sets up template engine (handlebars)
app.set('view engine', 'handlebars')            // sets up view engine 
app.set('views', './views')                     // registers where templates are


// Read the SQL file
const sqlFilePath = path.join(__dirname, 'database', 'DDL.sql');
const sqlCommands = fs.readFileSync(sqlFilePath, 'utf-8');
// Remove unnecessary newline characters
const sqlCommandsArray = sqlCommands.split(';');


const dbTablePKs = {
    "Investors":"investorID",
    "Stocks":"stockID",
    "Changes":"changeID",
    "Investments": "investID",
    "InvestedStocks": "investedStockID"
}

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

// Establish the database connection
quick.connect.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.get("/", function(req, res) {
    res.render('body', {

    })
})

app.get("/tables/:table", async function(req, res) {
    const tableName = req.params.table;
    const table = tableName.charAt(0).toUpperCase() + tableName.slice(1);
    const querySelect = `SELECT * FROM ${table};`
    quick.connect.query(querySelect, (error, results, fields) => {
        if (error) throw error;
        // console.log('results: ', results);
        // console.log(formatData(results));

        if(results.length === 0){
            res.render('editor', {
                body: "table",
                title: table
            });
        } else {
            const newObjects = formatData(results);

            res.render('editor', {
                body: "table",
                title: table,
                attributes: Object.keys(newObjects[0]),
                inputs: Object.values(newObjects)
            });
        }
    });
})

app.get('/delete/row', function(req, res) {
    const { table, row } = req.query;
    console.log("table, row: ", table, row);

    // Disable foreign key checks
    quick.connect.query('SET foreign_key_checks = 0', function(error) {
        if (error) {
            console.error('Error disabling foreign key checks:', error);
            res.json({ status: false, error: 'Error disabling foreign key checks' });
            return;
        }

        // Perform the DELETE operation
        const queryDelete = `DELETE FROM ${table} WHERE ${dbTablePKs[table]} = ${row}`;
        quick.connect.query(queryDelete, function(error, fields) {
            // Re-enable foreign key checks
            quick.connect.query('SET foreign_key_checks = 1', function(err) {
                if (err) {
                    console.error('Error enabling foreign key checks:', err);
                    res.json({ status: false, error: 'Error enabling foreign key checks' });
                    return;
                }

                if (error) {
                    console.error('Error deleting row:', error);
                    res.json({ status: false, error: 'Error deleting row' });
                } else {
                    res.json({ status: true });
                }
            });
        });
    });
});


app.get("/replace/:table", function (req, res) {
    // Disable foreign key checks
    db.pool.query('SET foreign_key_checks = 0;', function(error) {
        if (error) {
            console.error('Error disabling foreign key checks:', error);
            res.json({ status: false, error: 'Error disabling foreign key checks;' });
            return;
        }

        // Execute the replacement query
        const queryUpdate = replacementQueries[req.params.table];
        db.pool.query(queryUpdate, function(error, results) {
            if (error) {
                console.error('Error replacing table:', error);
                res.json({ status: false, error: 'Error replacing table' });
                return;
            }

            // Commit the transaction
            db.pool.query('COMMIT;', function(err) {
                if (err) {
                    console.error('Error committing transaction:', err);
                    res.json({ status: false, error: 'Error committing transaction' });
                    return;
                }

                // Enable foreign key checks
                db.pool.query('SET foreign_key_checks = 1;', function(err) {
                    if (err) {
                        console.error('Error enabling foreign key checks:', err);
                        res.json({ status: false, error: 'Error enabling foreign key checks' });
                        return;
                    }

                    res.json({ status: true });
                });
            });
        });
    });
});

// Route handler to handle GET requests for getting location by zip
app.get("/get-location/zip", function(req, res) {
    const zip = req.query["zip"];

    // // Execute your database query here using the existing connection object
    // quick.connect.query(cleanedSqlScript, (err, results) => {
    //     if (err) {
    //         console.error('Error executing SQL commands:', err);
    //         res.status(500).json({ error: 'Internal server error' });
    //         return;
    //     }

    //     console.log('SQL commands executed successfully:', results);

    //     // Send the response back to the client
    //     res.json({ status: true, results });
    // });

    // Iterate through each SQL command and execute it
    sqlCommandsArray.forEach((sqlCommand) => {
        if (sqlCommand.trim() !== '') { // Ignore empty commands
            quick.connect.query(sqlCommand, (error, results, fields) => {
                if (error) {
                    console.error('Error executing SQL command:', error);
                    res.json({status: false, error: error});
                    return;
                }

                // console.log('SQL command executed successfully:', results);
                console.log("Successful query");
            });
        }
    });
    console.log("sending response to client/browser");
    res.json({ status: true});
});

//Testing

// Connect to the database



app.get('*', function (req, res) {
    res.render('404')
})

// Listen on port
app.listen(port, function () {
    console.log("== Server is listening on port", port)
})


