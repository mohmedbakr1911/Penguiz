const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../DB/schemas/user.schema');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username.toLowerCase(),
            email: email,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully.'
        });

    } catch (error) {
        if (error.code === 11000 || (error.message && error.message.includes('duplicate key'))) {
            return res.status(409).json({ status: 'failed', message: 'Account with this username or email already exists.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ status: 'failed', message: 'Database validation failed', errors: error.errors });
        }
        res.status(500).json({ status: 'failed', message: 'Registration failed due to server error.' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username.toLowerCase() });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ status: "failed", message: "Invalid credentials. Please try again." });
        }

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

    } catch (error) {
        res.status(500).json({ status: 'failed', message: 'Login failed due to server error.' });
    }
};

const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true
        })
        
        res.status(200).json({ status: "success", message: "Successfully logged out." });

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Logout failed due to server error.' });
    }
};

module.exports = {
    register,
    login,
    logout
};
