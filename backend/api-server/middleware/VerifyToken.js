import jwt from "jsonwebtoken";
import { config } from "dotenv";
import User from "../models/User.js";

const { verify } = jwt;
config();

export const VerifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // 1. Check for token in cookies first
      let token = req.cookies?.token;

      if (!token && req.headers?.authorization) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return res.status(401).json({ message: "pls login first" });
      }

      // 2. Decode and verify token string
      let decodedToken = verify(token, process.env.SECRET_KEY);

      // 3. Check if user still exists in DB and strip out password hash
      const freshUser = await User.findById(decodedToken.id).select("-password");

      if (!freshUser) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      // 4. Role-based Authorization check
      if (allowedRoles.length > 0 && !allowedRoles.includes(freshUser.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" }); // Fixed to 403
      }

      // 5. Attach user object to request and pass execution down the chain
      req.User = freshUser;
      next();
    } catch (err) {
      console.error("Auth Middleware Error:", err.message);
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};