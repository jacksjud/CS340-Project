var mysql = require('mysql')
require('dotenv').config()

var connect = mysql.createConnection({
    connectionLimit : 10,
    host            : process.env.HOST,
    user            : 'cs340_jacksjud',
    password        : process.env.MYSQLPASS,
    database        : process.env.DB
})

// Export it for use in our application
module.exports.connect = connect;