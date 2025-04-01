const express = require('express');

const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  quizAttempts: Number,
  createdAt: Date
})

const User = mongoose.model('User', user_schema);

module.exports = User;