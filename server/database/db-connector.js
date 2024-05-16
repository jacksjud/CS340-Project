var mysql = require('mysql')
require('dotenv').config()

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.HOST,
    user            : 'cs340_jacksjud',
    password        : process.env.MYSQLPASS,
    database        : process.env.DB
})

// Export it for use in our application
module.exports.pool = pool;

