const express = require("express");
const router = express.Router();
const User = require("../models/User")
const bcrypt = require("bcryptjs");

router.get("/login",(req,res)=>{
    res.render("login");
});

router.get("/register",(req,res)=>{
    res.render("register");
});

router.post("/register",(req,res)=>{
    //console.log(req.body);
    const {name,email,password} =req.body;
    const errors =[];
    User.findOne({email:email},(err,user)=>{
        if(user){
            errors.push({msg:"Email is already registered"});
            res.render("register",{
                errors,
                name,email,password
            })
        }else{
            const newUser = new User({
                name,email,password
            });
        
            //encrypt password
            bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                       if(err){
                           throw error;
                       }else{
                           newUser.password = hash;
                           newUser.save((err)=>{
                               if(err) console.log(err);
                               else{
                                   req.flash('success_msg','You are now registered and can log in');
                                   res.redirect("/users/login");
                               }
                           })
                       }
                    })                   
            })
        }
    })
})

module.exports = router;