const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

module.exports = (passport)=>{
    passport.use(new LocalStrategy({
            usernameField:'email',
            passwordField:'password',
          },(email, password, done)=>{ 

          //Match User
          User.findOne({ email:email }, (err, user)=> {
            if (err) { return done(err); }
            if (!user) {
              return done(null, false, { message: 'That email is not registered' });
            }

            //Match password
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err) throw(err);

                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null,false,{ message: 'Password Incorrect'});
                }
            })
            
          });
        }
      ));

      passport.serializeUser((user, done) =>{
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done)=> {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}