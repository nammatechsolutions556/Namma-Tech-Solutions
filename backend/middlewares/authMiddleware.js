const jwt = require("jsonwebtoken");

const protectAdmin = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            // Admin token validation
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");

            if (decoded.role !== "admin") {
                return res.status(403).json({ message: "Not authorized as an admin" });
            }

            req.admin = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

const protectClient = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            // Client token validation
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");

            if (decoded.role !== "client") {
                return res.status(403).json({ message: "Not authorized as a client" });
            }

            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

module.exports = { protectAdmin, protectClient };
