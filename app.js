const express = require("express");
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const mongoose = require("mongoose");
const session = require('express-session');
const flash = require("connect-flash");
const passport = require("passport");
const app = express();

//Passport config
require('./config/passport')(passport);

//connect DB
const dbc = require("./config/keys"); 
mongoose.connect(dbc || "mongodb://localhost:27017/mydb" , {useNewUrlParser: true, useUnifiedTopology: true },
    ()=>{console.log("Database Connected")});

//Connect DB models
const User = require("./models/User");

//Views
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    hbs: allowInsecurePrototypeAccess(Handlebars),
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'index'
}));

//body parser
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//routes
app.use("/",require("./routes/index"));
app.use("/users",require("./routes/users"));

app.listen(3000, () => console.log("Server Started"))
