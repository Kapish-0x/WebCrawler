import exp from "express";
import User from "../models/User.js";
import { hash, compare } from "bcryptjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";

const { sign } = jwt;

export const commonApp = exp.Router();

//Registration
commonApp.post(
  "/users",
  expressAsyncHandler(async (req, res) => {
    const newUser = req.body;

    const allowedRoles = ["user", "admin"];
    if (!allowedRoles.includes(newUser.role)) {
      return res.status(400).json({ message: "Invalid Role" });
    }

    const existingUser = await User.findOne({ email: newUser.email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already Exists, pls Login." });
    }

    newUser.password = await bcrypt.hash(newUser.password, 12);

    const newUserDoc = new User(newUser);
    await newUserDoc.save();

    res.status(201).json({ message: "User Created" });
  }),
);

//Login
commonApp.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "No user found. Pls register." });
    }
    const isMatched = await compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    const signedToken = sign(
      {
        id: user._id,
        email: email,
        role: user.role,
        name: user.name,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      },
    );

    res.cookie("token", signedToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    let userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ message: "Login success", payload: userObj });
  }),
);
