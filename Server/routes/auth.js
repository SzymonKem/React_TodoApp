import express from "express";
import {
    // getUser,
    Login,
    Logout,
    Register,
    CheckRemembered,
} from "../controllers/auth.js";
import Validate from "../middleware/validate.js";
import { check } from "express-validator";

const router = express.Router();

router.post(
    "/register",
    check("username")
        .not()
        .isEmpty()
        .withMessage("Username is required")
        .trim()
        .escape(),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Must be at least 8 characters long"),
    Validate,
    Register
);

router.post(
    "/login",
    check("username")
        .not()
        .isEmpty()
        .withMessage("Enter a valid username")
        .escape(),
    check("password").notEmpty(),
    Validate,
    Login
);

router.post("/rememberedUser", CheckRemembered);
router.delete("/logout", Logout);

// router.get("/getuser", getUser);

export default router;
