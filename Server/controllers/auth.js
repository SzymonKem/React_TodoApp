import User from "../models/User.js";
import List from "../models/List.js";
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
        const foundUser = await User.findOne({
            username: username,
        });
        const sessionId = req.session.id;
        const foundUserId = foundUser.toObject()._id;
        const newList = new List({
            owner: { type: "user", id: foundUserId },
            tags: ["in progress", "done"],
            tasks: [],
        });
        const savedList = await newList.save();
        if (req.body.isChecked) {
            setCookies(sessionId, foundUserId, res);
        }
        res.status(200).json({
            status: "success",
            data: { username, foundUserId, usersList: savedList._id },
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
        const isPasswordValid = await bcrypt.compare(password, userPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Invalid password",
            });
        }
        const foundUserId = existingUser.toObject()._id;
        const usersList = await List.findOne({
            owner: { type: "user", id: foundUserId },
        });
        const sessionId = req.session.id;
        if (req.body.isChecked) {
            setCookies(sessionId, foundUserId, res);
        }
        res.status(200).json({
            status: "success",
            data: {
                username,
                foundUserId,
                sessionId,
                usersList: usersList._id,
            },
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

function setCookies(sessionId, userId, res) {
    res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("user", userId, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

export async function CheckRemembered(req, res) {
    if (!req.cookies.sessionId) {
        res.status(401).json({
            status: "not remembered",
            data: [false],
            message: "user not remembered. please log in",
        });
    } else {
        const list = await List.findOne({ "owner.id": req.cookies.user });
        res.status(200).json({
            status: "success",
            data: { logIn: true, user: req.cookies.user, list: list._id },
            message: "User remembered",
        });
    }
}

export async function Logout(req, res) {
    if (req.cookies !== null) {
        res.clearCookie("sessionId");
        res.clearCookie("user");
    }
    res.status(200).json({
        status: "success",
        message: "Successfully logged out",
    });
}
