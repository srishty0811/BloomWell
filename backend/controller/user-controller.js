import User from '../models/userModel.js';
import Journal from '../models/journalModel.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import bcrypt from 'bcryptjs';

// ====================== USER SIGNUP ======================
export const userSignup = async (req, res) => {
  try {
    console.log("➡️ Signup request received:", req.body);

    // Check if username or email already exists
    let exist = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
    if (exist) {
      return res.status(409).json({ msg: 'Username or email already exists!' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      bio: req.body.bio,
      age: req.body.age,
      profilePicture: req.file ? req.file.path : null,
    });

    await newUser.save();

    console.log("✔ User created successfully:", newUser.username);
    return res.status(200).json({ message: "Signup successful", user: newUser });

  } catch (error) {
    console.error("❌ Signup error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ====================== USER LOGIN ======================
export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("➡️ Login request:", username);

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log("✔ Login successful:", username);
    return res.status(200).json({ message: "Login success", user });

  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ====================== GET ALL USERS ======================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ====================== DELETE USER ======================
export const deleteUser = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOneAndDelete({ username });

    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }

    await Journal.deleteMany({ _id: { $in: user.journals } });

    return res.status(200).json({ msg: "User and journals deleted successfully" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ====================== UPDATE USER ======================
export const updateUser = async (req, res) => {
  try {
    const { username } = req.params;

    const updates = { ...req.body };

    // Hash password if changing
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    if (req.file) {
      updates.profilePicture = req.file.path;
    }

    const user = await User.findOneAndUpdate({ username }, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.error("❌ Update error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ====================== GET USER DETAILS ======================
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json(user);

  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
