const jwt = require('jsonwebtoken')

const authorization = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        res.status(403).json({ status: "failed", message: "You are not authorized" })
    }
    try {
        const user = jwt.verify(token, process.env.SECRET)
        req.user = user
        next()
    }
    catch {
        res.clearCookie("token")
        res.status(403).json({ status: "failed", message: "You are not authorized" })
    }
}

const isAdmin = (req, res, next) => {
    try {
        if (req.user.role === 'admin') {
            next()
        }
        else {
            res.status(403).json({ status: "failed", message: "You are not authorized" })
        }
    } catch (error) {
        res.status(403).json({ status: "failed", message: "You are not authorized" })
    }
}

const isUser = (req, res, next) => {
    try {
        if (req.user.role === 'user') {
            next()
        }
        else {
            res.status(403).json({ status: "failed", message: "You are not authorized" })
        }
    } catch (error) {
        res.status(403).json({ status: "failed", message: "You are not authorized" })
    }
}

module.exports = {
    authorization,
    isAdmin
}