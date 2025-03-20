const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Store API key in .env

const app = express();
app.use(cors()); // Allow frontend requests
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/getDefinition", async (req, res) => {
    const word = req.body.word;
    try {
        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                prompt: `You are a dictionary API. Provide ONLY the most common verb definition of the word "${word}". Exclude noun, adjective, and adverb definitions. Reply with JUST the definition and nothing else.`,
                max_tokens: 30,
                temperature: 0,
            })
        });

        const data = await response.json();
        res.json({ definition: data.choices[0].text.trim() });
    } catch (error) {
        console.error("Error fetching definition:", error);
        res.status(500).json({ error: "Failed to fetch definition" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
