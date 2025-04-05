const express = require('express')
const Quiz = require('../DB/schemas/quiz.schema')
const User = require('../DB/schemas/user.schema')

const create_quiz = async (req, res) => {
    try {
        const { title, description, category, timeLimit, questions, createdBy, createdAt } = req.body

        const new_quiz = new Quiz({
            title,
            description,
            category,
            timeLimit,
            questions,
            createdBy,
            createdAt
        })

        await new_quiz.save()
        res.status(200).json(new_quiz)
    } catch (error) {
        res.status(500).json({ message: error })
    }

}


const get_all_quizes = async (req, res) => {
    try {
        const quizes = await Quiz.find()
        if (!quizes) {
            res.status(404).json('no quizes found')
        }
        res.status(200).json(quizes)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}


const get_quiz = async (req, res) => {
    try {
        const { id } = req.params
        const quiz = await Quiz.findById(id)
        if (!quiz) {
            res.status(404).json("quiz not found")
        }

        res.status(200).json({ message: quiz })
    } catch (error) {
        res.status(500).json({ message: error })
    }


}


const update_quiz = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, category, timeLimit, questions } = req.body

        const quiz = await Quiz.findByIdAndUpdate(id,
            {
                title,
                description,
                category,
                timeLimit,
                questions
            }
        )

        if (!quiz) {
            res.status(404).json("quiz not found")

        }

        res.status(200).json(quiz)
    } catch (error) {
        res.status(500).json({ "error": error })
    }
}



const delete_quiz = async (req, res) => {
    try {
        const { id } = req.params
        const quiz = await Quiz.findByIdAndDelete(id)

        if (!quiz) {
            res.status(404).json("quiz not found")
        }

        res.status(200).json(quiz)
    } catch (error) {
        res.status(500).json({ error: error })
    }

}