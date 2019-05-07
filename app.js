const express = require('express');
const app = express();
const server = require('http').createServer(app);
const assert = require('assert');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
//const uri = "mongodb://172.16.32.40:27017/";
const uri = "mongodb://172.16.8.29:27017/";
let client = null;

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(session({
    secret:'this my sample session',
    resave:false,
    saveUninitialized:true
}));
app.use(flash());
//routes = require(__dirname+'/public/router/routes.js');

// dbManager = require(__dirname+'/public/scripts/dbManager.js');

//routes(app);

/// -----Login--- ////
app.get('/',(req,res)=>{
    res.render(__dirname+'/public/views/login.ejs');
});

/// --------Admin Start ---------////
app.get('/adminItems',(req,res)=>{
    client.db("ECommerce").collection('Items').find({}).toArray(function(err,doc){
        res.render(__dirname+'/public/views/adminItems.ejs',{'Data':doc});
    });
});
app.get('/adminSeller',(req,res)=>{
    //client.db("ECommerce").collection('Users').updateOne({'Name':'Seller seller'},{$set:{'Status':'Approved'}});
    client.db("ECommerce").collection('Users').find({'Type':'Seller','Status':'Approved'}).toArray(function(err,doc){
       console.log(doc);
       res.render(__dirname+'/public/views/adminSeller.ejs',{'data':doc});
    });
});
app.get('/adminDashboard',(req,res)=>{
   // client.db("ECommerce").collection('Users').insertOne({'Name':'Seller1 seller1','Username':'seller1','Password':'seller1','Type':'Seller','Status':'Pending'});
   client.db("ECommerce").collection('Users').find({'Type':'Seller','Status':'Pending'}).toArray(function(err,doc){
    console.log(doc);
    res.render(__dirname+'/public/views/adminDashboard.ejs',{'data':doc});
  });
});
/// --------Admin End ---------////


/// ----Seller start ---- //////

app.get('/sellerItems',function(req,res){
    res.render(__dirname+'/public/views/sellerItems.ejs');
})

app.get('/sellerRequest',function(req,res){
    res.render(__dirname+'/public/views/sellerRequest.ejs');
})

app.get('/sellerUpdateItems',function(req,res){
    res.render(__dirname+'/public/views/sellerUpdateItems.ejs');
})

//// -----Seller End ---- /////

app.post('/login',(req,res)=>{
    console.log(req.body);
    var Username = req.body.Username;
    var Password = req.body.Password;
    //client.db("ECommerce").collection('Users').insertOne({'Name':'Admin admin','Username':'admin','Password':'admin','Type':'Admin','EmailAdd':'alingasadan@gmail.com'});
    //client.db("ECommerce").collection('Users').insertOne({'Name':'Seller seller','Username':'seller','Password':'seller','Type':'Seller','Status':'Pending'});
    //client.db("ECommerce").collection('Users').insertOne({'Name':'Client client','Username':'client','Password':'client','Type':'Client'});
    client.db("ECommerce").collection('Users').findOne({'Username':Username,'Password':Password},(err,doc)=>{
        if(err){
            res.redirect("/");
        }else if(doc===null){
            res.redirect("/");
        }else if(doc!=null){
            if(doc.Type === 'Admin'){
                client.db("ECommerce").collection('Users').find({'Type':'Seller','Status':'Pending'}).toArray(function(err,doc){
                    console.log(doc);
                    res.render(__dirname+'/public/views/adminDashboard.ejs',{'data':doc});
                  });
            }else if(doc.Type === 'Seller' && doc.Status ==="Approved"){
                res.render(__dirname+"/public/views/seller_Approve_Success.ejs"); 
                //req.flash('error',"Your account not found!");
            }else{
                res.redirect('/');
            }
        }
        console.log(doc);   
      });
});

app.post('/register',(req,res)=>{
    console.log(req.body);
    var errors = [];
    var status = null;
    var toRegister;
    if(req.body.Password != req.body.ConfirmPassword){
        errors.push("Password not match!");
    }
    console.log(errors.length);
    if(errors.length==0){
        if(req.body.Type === 'Seller'){
            status = 'Pending';
        }
       if(status!==null){
            toRegister={
               'Name':req.body.FullName,
               'Username':req.body.Username,
               'EmailAdd':req.body.EmailAdd,
               'Password':req.body.Password,
               'Type':req.body.Type,
               'Status':status
           }
        }else{
           toRegister={
               'Name':req.body.FullName,
               'Username':req.body.Username,
               'EmailAdd':req.body.EmailAdd,
               'Password':req.body.Password,
               'Type':req.body.Type
           }
        }
        console.log("Wala error");
        client.db("ECommerce").collection('Users').findOne({'Username':req.body.Username},(err,doc)=>{
            if(doc!=null){errors.push("Username alreadyexist")}else{
                client.db("ECommerce").collection('Users').insertOne(toRegister);
            }
        });
        client.db("ECommerce").collection('Users').findOne({'EmailAdd':req.body.EmailAdd},(err,doc)=>{
              if(doc!=null){errors.push("Email already exist")}else{
                  client.db("ECommerce").collection('Users').deleteOne(toRegister);
                  client.db("ECommerce").collection('Users').insertOne(toRegister);
               }
        });
        //client.db("ECommerce").collection('Users').insertOne(toRegister);
    }
    
    // //console.log(toRegister);
    // for(i = 0;i<errors.length;i++){
    //     console.log(errors[i]);
    // }
    //client.db("ECommerce").collection('Users').insertOne({'Name':'Client client','Username':'client','Password':'client','Type':'Client'});
    res.redirect("/");
});
const port = process.env.PORT || 3000;

MongoClient.connect(uri,{useNewUrlParser:true},(err,res)=>{
    assert.equal(null, err);
    client = res;
    app.listen(port,(err,res)=>{console.log(`Listening to port ${port}.....`)});
});

 
