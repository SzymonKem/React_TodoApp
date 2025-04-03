import { validationResult } from "express-validator";

const Validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = {};
        errors.array().map((err) => (error[err.param] = err.message));
        return res.status(422).json({ errors });
    }
    next();
};

export default Validate;
