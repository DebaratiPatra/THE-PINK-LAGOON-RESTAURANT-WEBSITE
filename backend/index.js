// 
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";

import bookingRoutes from "./routes/bookings.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// If behind proxy (optional, e.g., on some deployment)
app.set('trust proxy', 1);

// CORS middleware: allow frontend origin with credentials (cookies)
app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true,
}));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set true in production with HTTPS
    maxAge: 1000 * 60 * 60, // 1 hour
  }
}));

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);

// Optional test route
app.get("/", (req, res) => {
  res.send("API running");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
