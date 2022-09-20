const mysql = require('mysql')
const db = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'admin123',
    database:'my-blog-db',
    insecureAuth : true
})

module.exports = db