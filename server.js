const express = require('express');
const app = express();
const  mysql = require("mysql");
let bodyParser = require("body-parser");
const formidable = require("formidable");
let fs = require("fs");
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

app.post("/api/add",function(req,res) {
    res.writeHead(200, {"Content-Type": "application/json"});
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log("Error");
            res.end(JSON.stringify({success: false, message: "Couldn't parse request"}));
            return;
        }
        let {name,address,info} = fields;
        let {dp} = files;
        if (!fs.existsSync("./buildings"))
            fs.mkdirSync("./buildings");
        if (!fs.existsSync(`./buildings/${name}`))
            fs.mkdirSync(`./buildings/${name}`);
        
        fs.rename(dp.path, `./buildings/${name}/${dp.name}`, (e) => {
            if (e) {
                res.end(JSON.stringify({success: false, message: "Couldn't upload image"}));
                return;
            }
            connection();
            con.query("insert into projects values(?,?,?,?,curdate())",[name,address,info,`./buildings/${name}/${dp.name}`],(err) => {
                if(err) {
                    res.end(JSON.stringify({success:false, message:"Unknown error occurred.Try again."}));
                }
                res.end(JSON.stringify({success:true, message:"Project added successfully"}));
            });
        });
    });
});

var port = 8000;
app.listen(port);
console.log("server on "+port);