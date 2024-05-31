// Get an instance of mysql we can use in the app
var mysql = require('mysql')
require('dotenv').config()

// Create a connection to the database using the provided credentials found in the .env file
var connect = mysql.createConnection({
    connectionLimit : 10,
    host            : process.env.HOST,
    user            : process.env.USERNAME,
    password        : process.env.MYSQLPASS,
    database        : process.env.DB
})

// Export it for use in our application
module.exports.connect = connect;