import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwtConfig.js";
import userModel from "../models/userModel.js";

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || 
        req.headers.authorization?.split(' ')[1] || 
        req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;
