const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY"); // Replace with your key

async function generateUI(requirementText) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
You are a UI/UX expert. Convert the following product requirements document into markdown that represents UI components.

Use sections, headers, checkboxes, tables, input forms, buttons, and layout suggestions using markdown. Output only valid, structured markdown that can be rendered into UI. Avoid explanations.

Example Components:
- ## Header
- ### Subsection
- **Button**: [Button Label]
- Input Field: **Label:** [________]
- Table: Markdown tables
- Form Layouts

Now process the following requirements:
${requirementText}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

app.post("/generate-ui", async (req, res) => {
  try {
    const { requirement } = req.body;
    const markdown = await generateUI(requirement);
    res.status(200).send({ status: "success", markdown });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ status: "error", message: "Failed to generate UI." });
  }
});

exports.generateUI = functions.https.onRequest(app);
