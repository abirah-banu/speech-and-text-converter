require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const app = express();
const port = 5000;
const upload = multer({ dest: "uploads/" }); // Ensure "uploads" folder exists

app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log("API Key:", OPENAI_API_KEY ? "Loaded" : "Not Found");

app.post("/transcribe", upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        
        const filePath = req.file.path;
        console.log("File Path:", filePath);
        console.log("Sending request to OpenAI...");

        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePath));
        formData.append("model", "whisper-1");

        const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                ...formData.getHeaders(),
            },
        });

        console.log("Response from OpenAI:", response.data);
        res.json(response.data);
        
        fs.unlinkSync(filePath); // Delete uploaded file after processing
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to transcribe audio" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
