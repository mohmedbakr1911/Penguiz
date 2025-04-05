const express = require('express')
const User = require('../DB/schemas/user.schema')
const bcrypt = require('bcrypt')
// const { findById } = require('../DB/schemas/quiz_attempt.schema')
const { isValidObjectId } = require('mongoose')

const app = express()

const get_all_users = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error.message)
    }

}


const getUser = async (req, res) => {
    try {
        const id = req.params.id
        if (!isValidObjectId(id)) {
            res.status(400).json({ message: "invalid user id" })
        }
        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({ message: "user not found" })
        }
        else {
            res.status(200).json({
                id: user._id,
                username: user.username,
                email: user.email,
                mohsens: user.mohsens,
            })
        }
    } catch (error) {
        res.status(500).json(error.message)
    }

}


const updateUser = async (req, res) => {
    try {
        const id = req.params.id
        const { username, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findByIdAndUpdate(id,
            { username, email, password: hashedPassword }
        )

        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        res.status(200).json({ status: "success", message: "User data updated successfully" })

    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        res.status(200).json({ status: "success", message: "User deleted successfully" });

    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message });
    }
};

module.exports = {
    get_all_users,
    getUser,
    updateUser,
    deleteUser
}