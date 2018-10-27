const express = require('express');
const app = express();
const  mysql = require("mysql");
let bodyParser = require("body-parser");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser({extended: true}));

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

app.post("/api/careers",function(req,res) {
    let {name,email,phone,current,position,info} = req.body;
    res.writeHead(200, {"Content-Type": "application/json"});
    connection();
    con.query("insert into careers values(?,?,?,?,?,?)",[name,email,phone,position,current,info],(err) => {
        if(err) {
            res.end(JSON.stringify({success:false, message:"Unknown error occurred.Try again."}));
        }
        res.end(JSON.stringify({success:true, message:"Received details. We will update you soon."}));
        });
});

app.get("/api/applications",function(req,res) {
    res.writeHead(200, {"Content-Type": "application/json"});
    connection();
    con.query("select * from careers",function(err,rows,fields) {
        if(err) {
            res.end(JSON.stringify({success: false,message: "Unknown error occurred"}));
        }
        res.end(JSON.stringify({success: true, message: rows}));
    });
    con.end();
});

var port = 8000;
app.listen(port);
console.log("server on "+port);