var express = require('express');
var app = express();
var server = require('http').createServer(app);
var assert = require('assert');

var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://172.16.8.29:27017/";
let client = null;

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//routes = require(__dirname+'/public/router/routes.js');

// dbManager = require(__dirname+'/public/scripts/dbManager.js');

//routes(app);

app.get('/',(req,res)=>{
    res.render(__dirname+   '/public/views/login.ejs');
});

app.post('/login',(req,res)=>{
    console.log(req.body.Username);
    var Username = req.body.Username;
    var Password = req.body.Password;
    
    client.db("ECommerce").collection('Users').findOne({'Username':Username,'Password':Password},(err,doc)=>{
        if(err){
            res.redirect("/");
        }else if(doc===null){
            res.redirect("/");
        }else if(doc!=null){
            if(doc.Type === 'Admin'){
             res.render(__dirname+"/public/views/adminDashboard.ejs")
            }else{
                res.redirect("/"); 
            }
        }
        console.log(doc);   
      });
});

app.post('/register',(req,res)=>{
    console.log(req.body.Type);
    res.send("LOGIN");
});
const port = process.env.PORT || 3000;

MongoClient.connect(uri,{useNewUrlParser:true},(err,res)=>{
    assert.equal(null, err);
    client = res;
    app.listen(port,(err,res)=>{console.log(`Listening to port ${port}.....`)});
});

 
