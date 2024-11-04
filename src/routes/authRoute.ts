import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { email, password, username } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, username });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res
    .status(404)
    .json({message: "Incorrect Password or Email" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({message: 'Incorrect Password or Email' });
  }
  return res.status(200).json({message: 'Login Successful' });
})
export default router;
