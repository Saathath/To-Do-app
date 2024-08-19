//using express
const express=require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//create an instance of express
const app=express();
app.use(express.json())
app.use(cors())

//Sample in memory storage for todo items
//let todos=[]

//connecting mongodb
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
    console.log('DB Connected!')

})
.catch((err)=>{
    console.log(err)
})

//creating schema
const todoSchema = new mongoose.Schema({
    title:{
        required:true,
        type: String
    },
    description:String

})

//creating model
const todoModel = mongoose.model('Todo',todoSchema);

//create a new todo item
app.post("/todo",async (req,res)=>{
    const {title,description} =req.body;
    //const newtodo={
    //    id:todos.length+1,
    //    title,
    //    description
    //};
    //todos.push(newtodo);
    //console.log(todos);
    try{
        const newTodo = todoModel({title,description})
        await newTodo.save(); 
        res.status(201).json(newTodo);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }    
});

//get all items
app.get('/todo', async(req,res)=>{
    try{
        const todos=await todoModel.find();
        res.json(todos);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }  
});

//update todo item
app.put("/todo/:id",async(req,res)=>{
    try{
        const {title,description} =req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title,description},
            {new: true}
        )
    
        if(!updatedTodo){
            return res.status(404).json({message:"todonot found"});
        }
        res.json(updatedTodo);    
    }
    catch(error){
        res.status(500).json({message:error.message});    
    }
});

//delete todo item
app.delete("/todo/:id",async(req,res)=>{
    try{
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch(error){
        res.status(500).json({message:error.message});     
    }
    
});

//start the server
const port=8000;
app.listen(port,()=>{
    console.log("server listening to port"+port);
});