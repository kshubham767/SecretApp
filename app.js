//jshint esversion:
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
require('dotenv').config();
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect('mongodb://127.0.0.1:27017/userDb',{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

const secret = process.env.SECRET;;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });

    newUser.save().then(function()
    {
        res.render("secrets");
    }).catch(function(err)
    {
        console.log(err);
    });
});

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({email: username}).then(function(foundUser)
    {
        if(foundUser.password === password)
        {
            res.render("secrets");
        }
        else
        {
            console.log("Wrong Password");
        }
    }).catch(function(err)
    {
        console.log(err);
    });
});



app.listen(3000,function()
{
    console.log("Server started on port 3000");
});