const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now
    },
    todos:[
            { type: mongoose.Schema.Types.ObjectId, 
              ref: 'Todo' }
    ]
})

const User = mongoose.model('User',UserSchema);
module.exports = User;