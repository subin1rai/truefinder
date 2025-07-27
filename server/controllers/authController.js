const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      dateOfBirth,
      gender,
      city,
      agreeToTerms,
    } = req.body;
    // Validate passwords match
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    if (!agreeToTerms)
      return res
        .status(400)
        .json({ message: "Please agree to terms and conditions" });

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      dateOfBirth,
      gender,
      city,
      agreeToTerms,
    });

    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .status(201)
      .json({
        message: "User registered successfully",
        token,
        userId: user._id,
        name: user.name,
        email: user.email,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, userId: user._id, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
