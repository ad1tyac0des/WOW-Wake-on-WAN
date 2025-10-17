const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            message: "No token provided!",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token!",
        });
    }
}

module.exports = authMiddleware;