import User from "../models/User.js";
import jwt from "jsonwebtoken";

const loggedEmails = new Set();

export const register = async (req, res) => {

  try {

    console.log("Register request body:", req.body);

    const { name = "", email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const user = new User({ name, email: email.toLowerCase(), password });
    await user.save();

    req.session.userEmail = user.email;
    loggedEmails.add(user.email);

    return res.status(201).json({ message: "Registered", user: { email: user.email, name: user.name } });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    if (loggedEmails.has(user.email) && req.session.userEmail !== user.email) {
      return res.status(400).json({ error: "User already logged in elsewhere." });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    req.session.userEmail = user.email;
    loggedEmails.add(user.email);

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: { email: user.email, name: user.name }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};

export const logout = async (req, res) => {
  try {
    const email = req.session?.userEmail;
    if (email && loggedEmails.has(email)) {
      loggedEmails.delete(email);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy:", err);
        return res.status(500).json({ error: "Logout failed." });
      }
      res.clearCookie("connect.sid");
      return res.json({ message: "Logged out" });
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};

export const status = async (req, res) => {
  const email = req.session?.userEmail || null;
  return res.json({ loggedIn: !!email, email });
};
