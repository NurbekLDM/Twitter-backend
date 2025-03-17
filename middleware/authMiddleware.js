const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; 

    if (!token) return res.status(401).json({ error: 'Avtorizatsiya talab qilinadi' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Noto‘g‘ri token' });
    }
};

module.exports = authMiddleware;
