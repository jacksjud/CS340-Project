const fs = require('fs/promises');
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

const dbTablePKs = {
    "Investors":"investorID",
    "Stocks":"stockID",
    "Changes":"changeID",
    "Investments": "investID",
    "InvestedStocks": "investedStockID"
}


// const testDatabaseConnection = async () => {
//     // Create a connection pool using environment variables
//     const pool = mysql.createPool({
//         connectionLimit: 10,
//         host: process.env.HOST,
//         user: user,
//         password: process.env.MYSQLPASS,
//         database: process.env.DB
//     });

//     // Attempt to connect to the database
//     pool.getConnection((err, connection) => {
//         if (err) {
//             console.error('Error connecting to database:', err.message);
//             return;
//         }

//         console.log('Database connected successfully!');
//         connection.release(); // Release the connection back to the pool
//     });
// };

// Call the function to test the database connection
// testDatabaseConnection();


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



app.get('*', function (req, res) {
    res.render('404')
})

// Listen on port
app.listen(port, function () {
    console.log("== Server is listening on port", port)
})


