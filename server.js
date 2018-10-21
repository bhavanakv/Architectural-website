const express = require('express');
const app = express();
const  mysql = require("mysql");
app.use(express.static(__dirname + '/public'));

var con;
function connection() {
    con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'root123',
        database:'website'
    }); 
    con.connect(function(err) {
        if(err) throw err;
            console.log("Connected!");
    }); 
}
connection();
var port = 8000;
app.listen(port);
console.log("server on "+port);