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
app.engine('handlebars', engine({defaultLayout: "main" }))    // Sets up template engine (.hbs instead of handlebars)
app.set('view engine', 'handlebars');                         // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
app.set('views', './views')                                   // Registers where templates are

// Other
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config()

// Use the static middleware and don't serve directory index files
app.use(express.static('static', { index: false }))
app.use(bodyParser.json());

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
app.use(favicon(path.join(__dirname, 'static/images', 'favicon.ico')));

// Database
const quick = require('./database/db-connector');
quick.connect.connect((err) => {                // Establish the database connection
    if (err) {
        console.error('== Error connecting to database: ', err);
        return;
    }
    console.log('== Connected to the database');
});

//***SECURITY WARNING***
const DEBUG = false;         //DEBUG -- Should always be set to false for production version
                             //         gives additional error output to website (renders errors in .json)


// Configurations or mappings for different aspects of application
const dbTablePKs = {
    "Investors":"investorID",
    "Stocks":"stockID",
    "Changes":"changeID",
    "Investments": "investID",
    "InvestedStocks": "investedStockID"
}

const doGraphs = {
    "Investors":false,
    "Stocks":true,
    "Changes":true,
    "Investments": true,
    "InvestedStocks": false
}

const attributes = {
    "Investors":true,
    "Stocks":true,
    "Changes":true,
    "Investments": true,
    "InvestedStocks": false
}

const search = {
    "Investors":false,
    "Stocks":false,
    "Changes":false,
    "Investments": true,
    "InvestedStocks": false
}

const dropdownConfigs = {
    "Investors":{
        "InvestorID": true,
        "Name": false
    },
    "Stocks":{
        "StockID": true,
        "Symbol": false,
        "CompanyName": false
    },
    "Changes":{
        "ChangeID": true,
        "StockID": true,
        "PriceOpen": false,
        "PriceClose": false,
        "PriceHigh": false,
        "PriceLow": false,
        "Date": false
    },
    "Investments": {
        "InvestID": true,
        "InvestorID": true,
        "Date": false
    },
    "InvestedStocks": {
        "InvestedStockID": true,
        "StockID": true,
        "InvestID": true,
        "Quantity": false,
        "Investment": false
    }
}

const buttonTitles = {
    "Investors": "investor",
    "Stocks": "stock",
    "Changes": "change in stock",
    "Investments": "investment",
    "InvestedStocks": "invested-in-stock"
}

// Functions

/* ================================================
--------------------------------------------------- 
Function:   formatDropDownData
===================================================

Desc: Gets available priority keys for drop down
menus.

================================================ */
async function formatDropDownData(results, tableName, dropdownConfig) {
    const inputs = {};

    // Helper function to fetch options for dropdowns
    const fetchOptions = async (attr) => {
        // Generates a select query based on an attribute and table name
        const querySelect = generateSelectQuery(tableName, attr);
        // Attempts to get query from database
        try {
            const queryResults = await new Promise((resolve, reject) => {
                quick.connect.query(querySelect, (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
            // If repeating data, call function to single it out and return that.
            return singleOutData(queryResults, attr);
        } catch (error) {
            console.error(`Error fetching dropdown options for ${attr}:`, error);
            return [];
        }
    };

    // Process specific attributes synchronously
    for (let result of results) {
        // Determine if the attribute needs a drop down display
        const isDD = dropdownConfig[tableName][result];
        if (isDD) {
            // Get drop down data
            const options = await fetchOptions(result);
            // Add info
            inputs[result] = {
                attr: result,
                isDropdown: isDD,
                options: options
            };
        }
    }

    // Process the remaining attributes
    await Promise.all(results.map(async (result) => {
        // Determine if the attribute needs a drop down display
        const isDD = dropdownConfig[tableName][result];
        if (isDD) {
            let options = [];
            if (isDD) {
                options = await fetchOptions(result);
            }
            inputs[result] = {
                attr: result,
                isDropdown: isDD,
                options: options
            };
        // If the attribute doesn't need drop down info, just give options an empty arrary
        } else{
            let options = []
            inputs[result] = {
                attr: result,
                isDropdown: isDD,
                options: options
            };
        }
    }));

    return inputs;
}

/* ================================================
--------------------------------------------------- 
Function:   singleOutData
===================================================

Desc: Takes data (table keys/ numbers), if there are 
any repeating data, single it out, and return it 
in ascending order.

================================================ */
function singleOutData(data, attribute){
    const uniqueValues = new Set();
    data.forEach(item => {
        uniqueValues.add(item[attribute]);
    });
    return [...uniqueValues].sort((a, b) => a - b);
}

/* ================================================
--------------------------------------------------- 
Function:   formatData
===================================================

Desc: Takes data that the sql server gives initially
and parses it to suit our needs.

================================================ */
function formatData(results) {
    return results.map(row => {
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

/* ================================================
--------------------------------------------------- 
Function:   generateSelectQuery
===================================================

Desc: Returns a select query from a given table,
and attribute. Optionally, a comparison can be
provided that will implement a WHERE clause
for the provided attribute.

================================================ */
function generateSelectQuery(tableName, attribute , comparison=null){
    let query = `SELECT ${attribute} FROM ${tableName}`;
    if (comparison !== null) {
        query += ` WHERE ${attribute} = ${comparison}`;
    }
    return query;
}

/* ================================================
--------------------------------------------------- 
Function:   generateUpdateQuery
===================================================

Desc: Generates an update query given a table name,
a primary key to search for and what value it
should have, and an object of the attributes
to change (as keys) and their corresponding
updated values. 

================================================ */
function generateUpdateQuery(table, primaryKeyName, primaryKey, updatedValues) {
    const setClauses = Object.keys(updatedValues)
        .map(key => `${key} = '${updatedValues[key]}'`)
        .join(', ');

    const query = `UPDATE ${table} SET ${setClauses} WHERE ${primaryKeyName} = '${primaryKey}';`;
    
    return query;
}

/* ================================================
--------------------------------------------------- 
Function:   generateInsertQuery
===================================================

Desc: Takes a table name, columns to add to, and
values to insert and generates an insert query.

================================================ */
function generateInsertQuery(tableName, columns, values) {
    // Generate the columns part of the query
    const columnsPart = columns.join(', ');

    // Generate the values part of the query
    const valuesPart = `(${values.map(value => typeof value === 'string' ? `'${value}'` : value).join(', ')})`;

    // Construct the final query string
    const query = `INSERT INTO ${tableName} (${columnsPart}) VALUES ${valuesPart};`;

    return query;
}

/*
    ROUTES
*/
// Display index page
app.get("/", function(req, res) {
    res.render('body')
})

// Display pages with their corresponding data
app.get("/tables/:table", async function(req, res, next) {  // Mark the function as async
    const tableName = req.params.table;
    const table = tableName.charAt(0).toUpperCase() + tableName.slice(1);
    const querySelect = `SELECT * FROM ${table};`

    quick.connect.query(querySelect, async (error, results) => {  // Make the callback async
        if (error){
            if (!DEBUG) { // If DEBUG is false, don't handle SQL error 
                return;
            }
            // If DEBUG is true, log the error (makes sitre crash unless handled differently)
            console.error("Invalid table name:", tableName);
            res.status(404).send("Invalid table name");
            throw error;
        }

        if (results.length === 0) {
            res.render('editor', {
                body: "table",
                title: table
            });
        } else {
            const newObjects = formatData(results);
            const keys = Object.keys(newObjects[0]);
            const values = Object.values(newObjects);
            try {
                const crudInputs = await formatDropDownData(keys, table, dropdownConfigs);  // Await the testFormatData call
                res.render('editor', {
                    body: "table",
                    title: table,
                    attributes: keys,
                    crudInputs: crudInputs,
                    inputs: values,
                    dograph: doGraphs[table],
                    search: search[table],
                    buttonTitle: buttonTitles[table]
                });
            } catch (error) {
                console.error("Error formatting data:", error);
                res.status(500).send("Server error");
            };
        };
    });
});

// Delete data in row of corresponding page
app.get('/delete/row', function(req, res) {
    const { table, row } = req.query;

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


// Route handler to handle GET requests for replacing table data (currently, all of it)
app.get("/replace-table/table", function(req, res) {
    const table = req.query["table"];
    console.log("== Table to Replace: ", table);
    const sqlFilePath = path.join(__dirname, 'database/refill', `refill${table}.sql`);
    const sqlCommands = fs.readFileSync(sqlFilePath, 'utf-8');
    const sqlCommandsArray = sqlCommands.split(';');
    // Iterate through each SQL command and execute it
    sqlCommandsArray.forEach((sqlCommand) => {
        if (sqlCommand.trim() !== '') { // Ignore empty commands
            quick.connect.query(sqlCommand, (error, results, fields) => {
                if (error) {
                    console.error('Error executing SQL command:', error);
                    res.json({status: false, error: error});
                    return;
                }
            });
        }
    });
    console.log("== Table Replaced Successfully");
    res.json({ status: true});
});

app.get("/replace-table/all", function(req, res) {
    // Currently not used, it's the table name. could be useful for other stuff later
    const sqlFilePath = path.join(__dirname, 'database/refill', `refillTables.sql`);
    const sqlCommands = fs.readFileSync(sqlFilePath, 'utf-8');
    const sqlCommandsArray = sqlCommands.split(';');
    // Iterate through each SQL command and execute it
    sqlCommandsArray.forEach((sqlCommand) => {
        if (sqlCommand.trim() !== '') { // Ignore empty commands
            quick.connect.query(sqlCommand, (error, results, fields) => {
                if (error) {
                    console.error('Error executing SQL command:', error);
                    res.json({status: false, error: error , message: "Could not repopulate all tables"});
                    return;
                }
            });
        }
    });
    console.log("== All Tables Replaced Successfully");
    res.json({ status: true, message: "Successfully repopulated all tables"});
});

app.post("/create-table", (req, res) => {
    const tableData = (req.body);

    console.log("Received Table Data: ", tableData);
    // let tableName = tableData["tableName"]

    // Variables we'll have input for (columns)
    var columns = Object.keys(tableData)
    // Removes first two elements
    columns.shift();
    columns.shift();

    // Values to add
    var insertValues = Object.values(tableData)
    // Save table name in variable 
    var tableName = insertValues[0]
    // Removes first element (table name)
    insertValues.shift();
    insertValues.shift();

    const queryCreate = generateInsertQuery(tableName , columns, insertValues )
    // console.log(queryCreate);
    // const queryCreate = `INSERT INTO ${tableData["tableName"]}`
    quick.connect.query(queryCreate, (error, results, fields) => {
        if(error){
            console.error("Error executing SQL command: ", error)
            // Specifically handles errors when creating a table, like leaving an input as NULL etc.
            let errorMessage = "Row not created";
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                errorMessage = "Foreign key constraint error! Make sure only the first input has NULL!\n\n" + error.message;
            } else if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
                errorMessage = "Data type mismatch error! One of the input fields has an invalid type (like letters where numbers go)!\n\n" + error.message;
            } else {
                errorMessage = "SQL error: " + error.message;
            }

            res.status(400).json({ status: false, message: errorMessage });
        } else {
            console.log("== Row Successfully Created")
            res.json({ status: true });
        }
    })
})

app.post("/update-row", (req, res) => {
    const tableData = (req.body);

    var columns = Object.keys(tableData)
    // Get table name
    var tableName = tableData[columns[0]]
    // Get primary key name
    var primaryKeyName = columns[1];
    // Get actual primary key we're updating
    var primaryKey = tableData[primaryKeyName];

    // Delete first two elements of table data (table name and PK)
    delete tableData[columns[0]]
    delete tableData[primaryKeyName]
    
    // Get update query
    const queryUpdate = generateUpdateQuery(tableName , primaryKeyName , primaryKey, tableData)
    
    // Make query with plenty of error handling
    quick.connect.query(queryUpdate, (error, results, fields) => {
        if (error) {
            console.error("Error executing SQL command: ", error);

            // Handle specific SQL errors like 
            let errorMessage = "Row not updated";
            if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
                errorMessage = "Data type mismatch error! One of the input fields has an invalid type (like letters where numbers go)!\n\n" + error.message;
            } else {
                errorMessage = "SQL error: " + error.message;
            }
            res.status(400).json({ status: false, message: errorMessage });
        } else {
            console.log("== Row Successfully Updated");
            res.json({ status: true, message: "Row successfully updated" });
        }
    });
})

// Catch-all other routes not defined
app.get('*', function (req, res) {
    res.render('404')
})


/*
    LISTENER
*/
app.listen(PORT, function(){    // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://'+ hostname +':' + PORT + ' press Ctrl-C to terminate.');
});