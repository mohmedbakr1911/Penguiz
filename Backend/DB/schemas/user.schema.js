const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const user_schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long.'],
  },
  mohsens: { type: Number, default: 0 },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}
)

const User = mongoose.model('User', user_schema)

module.exports = User