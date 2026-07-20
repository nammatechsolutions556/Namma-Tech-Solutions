const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || "default_secret", {
        expiresIn: "30d",
    });
};

// Admin Login
const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);

        // If no admin is found, we can optionally hardcode checking "admin@namma.com" and "admin123" to seed it
        if (result.rows.length === 0) {
            if (email === "admin@namma.com" && password === "AfsheenAshok*1921") {
                // Seed the default admin
                const hashedPassword = await bcrypt.hash(password, 10);
                const newAdmin = await pool.query(
                    "INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING *",
                    [email, hashedPassword]
                );
                return res.json({
                    _id: newAdmin.rows[0].id,
                    email: newAdmin.rows[0].email,
                    token: generateToken(newAdmin.rows[0].id, "admin")
                });
            } else {
                return res.status(401).json({ message: "Invalid email or password" });
            }
        }

        const admin = result.rows[0];

        // Compare password with hashed admin password
        if (admin && (await bcrypt.compare(password, admin.password))) {
            res.json({
                _id: admin.id,
                email: admin.email,
                token: generateToken(admin.id, "admin"),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Client Registration
const registerClient = async (req, res) => {
    const { name, email, number, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await pool.query("SELECT * FROM client_users WHERE email = $1", [email]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        const result = await pool.query(
            "INSERT INTO client_users (name, email, number, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, number, hashedPassword]
        );

        const user = result.rows[0];

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            number: user.number,
            token: generateToken(user.id, "client"),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

// Client Login
const loginClient = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM client_users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = result.rows[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                number: user.number,
                token: generateToken(user.id, "client"),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login" });
    }
};

module.exports = {
    adminLogin,
    registerClient,
    loginClient
};
