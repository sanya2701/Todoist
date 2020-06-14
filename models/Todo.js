const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    tname:{
        type:String,
    },
    user:{ 
              type: mongoose.Schema.Types.ObjectId, 
              ref: 'User' }
})

const Todo = mongoose.model('Todo',TodoSchema);
module.exports = Todo;