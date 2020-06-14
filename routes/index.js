const express = require("express");
const {ensureAuthenticated} = require("../config/auth");
const Todo = require("../models/Todo")
const router = express.Router();

router.get("/",(req,res)=>{
    res.render("index");
});

router.get("/mytodo",ensureAuthenticated,(req,res)=>{
    const userID = req.user._id;
    Todo.find({user:userID},(err,todos)=>{
        if(err) console.log(err);
        else{
            res.render("main",{todos:todos.map(todo=>todo.toJSON())});
        }
    })
})

router.post("/mytodo",ensureAuthenticated,(req,res)=>{
    const userID = req.user._id;
    const newTodo = new Todo({
        tname:req.body.tname,
        user:userID
    });
    newTodo.save((err)=>{
        if(err) console.log(err);
        else{
            req.flash('success_msg','Your ToDo added successfully');
            res.redirect("/mytodo");
        } 
    })
})

router.get("/:id/deltodo",(req,res)=>{
    Todo.find({_id:req.params.id},(err,todo)=>{
        if(err) console.log(err);
        else{
            Todo.deleteOne({_id:req.params.id},(err)=>{
                if(err) console.log(err);
                else res.redirect("/mytodo");
            })
        }
    })
})

module.exports = router;