const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user"); // Ensure the correct path

// Endpoint to get all users (for testing purposes)
router.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to register a user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User instance
    const newUser = new UserModel({ name, email, password: hashedPassword });

    // Save user to the database
    await newUser.save();

    // Respond with success message
    res.status(202).json({
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Endpoint to log in a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in user", error);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
