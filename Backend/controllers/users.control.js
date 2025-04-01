const express = require('express')
const User = require('../DB/schemas/user.schema');
const { findById } = require('../DB/schemas/quiz_attempt.schema');
// const user_schema = require('../DB/schemas/user.schema')

const app = express()

const get_all_users = async (req,res)=>{
    try {
        const users = await User.find();
        res.status(200).json(users)
        console.log(users);
    } catch (error) {
        res.status(500).json(error.message);
    }
    
}


const getUser = async (req, res)=>{
    try {
        const {email} = req.body();
        const user = await findone(email);
        res.status(200).json({"message":`${user} is your user`});
    } catch (error) {
        res.status(500).json(error.message);
    }
    
}


const createUser = async (req,res)=>{
    try {
        const {username, email, password, quizAttempts, createdAt} = req.body;
        const isExist = await User.findone(email);
        if(isExist)
        {
            return res.status(400).json({message: "Email is already exist"})
        }

        const newUser = new User({
            username,
            email,
            password,
            quizAttempts,
            createdAt
        });

        await newUser.save();

        res.status(201).json({message: `${newUser}`})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const updateUser = async (req,res)=>{
    try {
    const {id} = req.params;
    const {username,email,password} = req.body
    const user = await User.findByIdAndUpdate(id,
        {username, email, password}
    );

    if(!user)
    {
       return res.status(404).json({message: "user not found"})
    }
    res.status(200).json({message: user})
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    

}