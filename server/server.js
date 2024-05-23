const fs = require('fs');
const path = require('path');
const handlebars = require("handlebars")
const { engine } = require('express-handlebars');
const express = require('express')
const quick = require('./database/db-quick');
const os = require('os');
const bodyParser = require('body-parser');
require('dotenv').config()


// Create the express server
var app = express()
var port = process.env.PORT || 3000 // PORT
const hostname = os.hostname();

// Use the static middleware and don't serve directory index files
app.use(express.static('static', { index: false }))
app.use(bodyParser.json());
// Use handlebars
app.engine('handlebars', engine({ defaultLayout: "main" }))   // sets up template engine (handlebars)
app.set('view engine', 'handlebars')            // sets up view engine 
app.set('views', './views')                     // registers where templates are

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
};


// function template: 
/* ================================================
--------------------------------------------------- 
Function:   
===================================================

Desc:

================================================ */




/* ================================================
--------------------------------------------------- 
Function:   formatData
===================================================

Desc: Takes data that the sql server gives initially
and parses it to suit our needs

================================================ */
// function testFormatData(results, tableName, dropdownConfig) {


//     const inputs = {}
//     results.forEach( result => {
//         const isDD = dropdownConfig[tableName][result]
//         let options = [];
//         if(isDD){
//             querySelect = selectQuery(tableName , result)
//             quick.connect.query(querySelect, (error, results, fields) => {
//                 if (error) throw error;
//                 else{
//                     // console.log(results)
//                     options = singleOutData(results , result)
//                     console.log(options)
//                     inputs[result] = {
//                         attr: result,
//                         isDropdown: isDD,
//                         options: options
//                     }

//                 }
//             });
//         } else {
//             inputs[result] = {
//                 attr: result,
//                 isDropdown: isDD,
//                 options: options
//             }
//         }
        
//     })
//     console.log(inputs)
//     return inputs;
// }

// async function testFormatData(results, tableName, dropdownConfig) {
//     const inputs = {};

//     // Collect unique attributes from the results
//     const attributes = results;

//     // Use Promise.all to handle multiple asynchronous operations
//     await Promise.all(attributes.map(async (result) => {
//         const isDD = dropdownConfig[tableName] && dropdownConfig[tableName][result];
//         let options = [];
//         if (isDD) {
//             const querySelect = selectQuery(tableName, result);
//             try {
//                 const queryResults = await new Promise((resolve, reject) => {
//                     quick.connect.query(querySelect, (error, results) => {
//                         if (error) {
//                             reject(error);
//                         } else {
//                             resolve(results);
//                         }
//                     });
//                 });
//                 options = singleOutData(queryResults, result);
//             } catch (error) {
//                 console.error(`Error fetching dropdown options for ${result}:`, error);
//             }
//         }
//         inputs[result] = {
//             attr: result,
//             isDropdown: isDD,
//             options: options
//         };
//     }));

//     console.log(inputs);
//     return inputs;
// }

async function testFormatData(results, tableName, dropdownConfig) {
    const inputs = {};

    // Helper function to fetch options for dropdowns
    const fetchOptions = async (attr) => {
        const querySelect = selectQuery(tableName, attr);
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
            return singleOutData(queryResults, attr);
        } catch (error) {
            console.error(`Error fetching dropdown options for ${attr}:`, error);
            return [];
        }
    };

    // Process specific attributes synchronously
    for (let result of results) {
        const isDD = dropdownConfig[tableName][result];
        if (isDD) {
            const options = await fetchOptions(result);
            inputs[result] = {
                attr: result,
                isDropdown: isDD,
                options: options
            };
        }
    }

    // Process the remaining attributes
    await Promise.all(results.map(async (result) => {
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
function singleOutData(data, attribute){
    const uniqueValues = new Set();
    data.forEach(item => {
        uniqueValues.add(item[attribute]);
    });
    return [...uniqueValues].sort((a, b) => a - b);
}

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


function selectQuery(tableName, attribute , comparison=null){
    let query = `SELECT ${attribute} FROM ${tableName}`;
    if (comparison !== null) {
        query += ` WHERE ${attribute} = ${comparison}`;
    }
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

// Establish the database connection
quick.connect.connect((err) => {
    if (err) {
        console.error('== Error connecting to database:', err);
        return;
    }
    console.log('== Connected to the database');
});

app.get("/", function(req, res) {
    res.render('body', {

    })
})
app.get("/tables/:table", async function(req, res) {  // Mark the function as async
    const tableName = req.params.table;
    const table = tableName.charAt(0).toUpperCase() + tableName.slice(1);
    const querySelect = `SELECT * FROM ${table};`

    quick.connect.query(querySelect, async (error, results) => {  // Make the callback async
        if (error) throw error;

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
                const crudInputs = await testFormatData(keys, table, dropdownConfigs);  // Await the testFormatData call
                console.log(keys)
                console.log(values)
                console.log(crudInputs)
                res.render('editor', {
                    body: "table",
                    title: table,
                    attributes: keys,
                    crudInputs: crudInputs,
                    inputs: values,
                    dograph: doGraphs[table],
                    search: search[table]
                });
            } catch (error) {
                console.error("Error formatting data:", error);
                res.status(500).send("Server error");
            }
        }
    });
});

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
    // Currently not used, it's the table name. could be useful for other stuff later
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

                // console.log('SQL command executed successfully:', results);
                // console.log("Successful query");
            });
        }
    });
    console.log("== Table Replaced Successfully");
    res.json({ status: true});
});

app.get("/replace-table/all", function(req, res) {
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

                // console.log('SQL command executed successfully:', results);
                // console.log("Successful query");
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
            res.json({status : false, message: "row not created"})
        } else {
            console.log("== Row Successfully Created")
            res.json({ status: true });
        }
    })




    // res.json({ status: true , message: "table data received successfully"});
})


app.get('*', function (req, res) {
    res.render('404')
})


/*
    LISTENER
*/
app.listen(port, function(){    // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('== Express started on http://'+ hostname +':' + port + ' press Ctrl-C to terminate.');
});
