import User from "../models/User.js";
import bcrypt from "bcrypt";

export async function Register(req, res) {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "Account with this username already exists",
            });
        }
        const savedUser = await newUser.save();
        res.status(200).json({
            status: "success",
            data: [{ username }],
            message: "Your account has been successfully created",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: [],
            message: "An unexpected error happened 2" + err.message,
        });
    }
    res.end();
}

export async function Login(req, res) {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "This user doesn't exist in the database",
            });
        }
        const userPassword = existingUser.password;
        // console.log(existingUser);
        // console.log(password);
        // console.log(userPassword);
        const isPasswordValid = await bcrypt.compare(
            req.body.password,
            userPassword
        );
        if (!isPasswordValid) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Invalid password",
            });
        }
        return res.status(200).json({
            status: "success",
            data: [{ username }],
            message: "Logged in",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: [],
            message: "An unexpected error happened 1" + err.message,
        });
    }
    res.end();
}

export async function getUser(req, res) {
    const username = req.query.username;
    console.log(username);
    try {
        const foundUser = await User.findOne({
            username: username,
        });
        const foundUserId = foundUser.toObject()._id;
        res.status(200).json({
            status: "success",
            data: { userId: foundUserId },
            message: "Succesfully got userId",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "An unexpected error happened " + err.message,
        });
    }
}
