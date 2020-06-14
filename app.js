const express = require("express");
const methodOverride = require('method-override')
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const mongoose = require("mongoose");
const session = require('express-session');
const flash = require("connect-flash");
const passport = require("passport");
const app = express();
require('dotenv').config()


//method override for put and delete requests
app.use(methodOverride('_method'))

//Passport config
require('./config/passport')(passport);

//connect DB
const MONGODB_URI = require("./config/keys"); 
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mydb" , {useNewUrlParser: true, useUnifiedTopology: true },
    ()=>{console.log("Database Connected")});

//Connect DB models
const User = require("./models/User");
const Todo = require("./models/Todo");

//Views
app.engine('hbs', exphbs({
    hbs: allowInsecurePrototypeAccess(Handlebars),
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'index'
}));
app.set('view engine', 'hbs');


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

app.listen(process.env.PORT || 3000, () => console.log("Server Started"))
