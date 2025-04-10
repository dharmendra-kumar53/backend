import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";  // MongoDB connection
import authRoutes from "./routes/auth.route.js";  // Auth routes
import messageRoutes from "./routes/message.route.js";  // Message routes
import { app, server } from "./lib/socket.js";  // Socket.io setup

// Load environment variables
dotenv.config();

// Define the port from environment variables
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve(); // Resolve the current directory path

// Middleware Setup
app.use(express.json({ limit: "50mb" }));  // Parse JSON requests with a large size limit
app.use(express.urlencoded({ limit: "50mb", extended: true }));  // Parse URL-encoded requests
app.use(cookieParser());  // Parse cookies

// CORS configuration
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5175'],  // Allow frontend origins
    credentials: true,  // Allow cookies and authorization headers
  })
);

// API Routes
app.use("/api/auth", authRoutes);  // Authentication routes
app.use("/api/messages", messageRoutes);  // Messaging routes

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));  // Serve frontend assets

  // Catch-all route for any route not handled above, sending the index.html of the frontend
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

module.exports = (req, res) => {
  res.status(200).json({ message: "Hello from Vercel serverless function!" });
};


// Start the server and connect to MongoDB
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();  // Connect to MongoDB
});
