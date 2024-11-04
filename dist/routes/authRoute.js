"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../models/userModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
router.post('/signup', async (req, res, next) => {
    const { email, password, username } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const existingEmail = await userModel_1.default.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        if (username) {
            const existingUsername = await userModel_1.default.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ message: 'Username already exists' });
            }
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new userModel_1.default({ email, password: hashedPassword, username });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
});
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await userModel_1.default.findOne({ email });
    }
    catch (err) {
        return console.log(err);
    }
    if (!existingUser) {
        return res
            .status(404)
            .json({ message: "Incorrect Password or Email" });
    }
    const isPasswordCorrect = bcrypt_1.default.compareSync(password, existingUser.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Incorrect Password or Email' });
    }
    return res.status(200).json({ message: 'Login Successful' });
});
exports.default = router;
//# sourceMappingURL=authRoute.js.map