import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
      twitter,
      linkedin,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000), // Default is 0
      impressions: Math.floor(Math.random() * 1000), // Default is 0
      twitter,
      linkedin,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      // const message = document.getElementById('errorMessage');
      // throw "User does not exist: Please sign up to log in.";
      return res.status(400).json({ msg: "User does not exist: Please sing up to log in." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // const message = document.querySelector('#errorMessage');
      // throw "Invalid credentials: Input password is wrong.";
      return res.status(401).json({ msg: "Invalid credentials: Input password is wrong." });
    }
    const JWT_SECRET = 'somesuperhardstringtoguess';
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};