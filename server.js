// Add these imports at the top
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { generate } from "./chatbot.js";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

// API endpoint for chat
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await generate(userMessage);

    res.json({
      response,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Serve the frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Keep your existing AI functions below
// ... rest of your existing code ...
