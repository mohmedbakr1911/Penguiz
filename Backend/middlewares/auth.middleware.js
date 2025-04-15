const jwt = require('jsonwebtoken')

const authorization = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(403).json({ status: "failed", message: "You are not logged in" })
    }
    try {
        const user = jwt.verify(token, process.env.SECRET)
        req.user = user
        next()
    }
    catch {
        res.status(403).json({ status: "failed", message: "You are not logged in" })
    }
}

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res
      .status(403)
      .json({ status: "failed", message: "You are not authorized" });
  }

  if(req.user.role !== "admin")
  {
   return res
     .status(403)
     .json({ status: "failed", message: "You are not admin" }); 
  }
  next();
};


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

const isGuest = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next();
    }
    try {
        jwt.verify(token, process.env.SECRET);
        return res.status(403).json({ status: "failed", message: "You are already logged in" });
    } catch (error) {
        res.clearCookie("token");
        return next();
    }
};

module.exports = {
    authorization,
    isAdmin,
    isGuest,
    isUser
};