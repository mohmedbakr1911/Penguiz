const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../DB/schemas/user.schema')

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            const errors = {};
            if (!username) {
                errors.username = 'Username is required.';
            }
            if (!email) {
                errors.email = 'Email is required.';
            }
            if (!password) {
                errors.password = 'Password is required.';
            }

            return res.status(400).json({
                status: 'fail',
                message: 'Please provide all required fields.',
                errors: errors
            });
        }

        const existingUser = await User.findOne({
            $or: [
                { username: username.toLowerCase() },
                { email: email.toLowerCase() }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                status: 'fail',
                message: 'Account with this username or email already exists.',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        req.body.password = password;
        await login(req, res);

    } catch (error) {
        res.status(500).json({ status: 'failed', message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const errors = {};
        if (!username || !password) {
            if (!username) {
                errors.username = 'Username is required.';
            }
            if (!password) {
                errors.password = 'Password is required.';
            }
            res.status(400).json({ status: "failed", message: "Username or Password is missing", errors: errors })
        }
        else {
            const user = await User.findOne({ username: username })
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const payload = {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    mohsens: user.mohsens
                };

                const token = jwt.sign(payload, process.env.SECRET, {
                    expiresIn: '24h'
                });

                res.cookie("token", token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000
                })
                    .status(200)
                    .json({ status: "success", message: "Successfully logged in." });
            }
            else {
                res.status(400).json({ status: "failed", message: "Username or Password is wrong, Please try again." })
            }
        }

    } catch (error) {
        res.status(500).json({ status: 'failed', message: error.message })
    }
}


module.exports = {
    register,
    login
}