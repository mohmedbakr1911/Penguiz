const express = require('express')
const db_connection = require('./DB/db')
const app = express()
const cookieParser = require("cookie-parser")
app.use(cookieParser());
app.use(express.json())
require('dotenv').config();


const userRouter = require('./Routes/user.route')
const authRouter = require('./Routes/auth.route')

app.use('/users', userRouter)
app.use(authRouter)

app.listen(3000, () => {
    console.log('app is running on port 3000')
})

//ThHQGXYDaExNyIge

//mongodb+srv://2022170867:<db_password>@penguiz.7vkhzdf.mongodb.net/?retryWrites=true&w=majority&appName=Penguiz