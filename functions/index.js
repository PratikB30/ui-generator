const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyCZTg7CnYJ6hxAdWS_VRDqagGUvjzIp7fk"); // Replace with your key

async function generateUI(requirementText) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  const prompt = `
You are a UI/UX expert. Convert the following product requirements document into markdown that represents UI components.

Use sections, headers, checkboxes, tables, input forms, buttons, and layout suggestions using markdown. Output only valid, structured markdown that can be rendered into UI. Avoid explanations.

- For buttons, use HTML: <button>Button Label</button>
- For input fields, use HTML: <label>Label: <input type="text" placeholder="Label" /></label>
- For tables, use HTML: <table><tr><th>Header</th></tr><tr><td>Cell</td></tr></table>
- For checkboxes, use HTML: <label><input type="checkbox" /> Label</label>

Example Components:
- ## Header
- ### Subsection
- <strong>Button:</strong> <button>Button Label</button>
- Input Field: <label>Label: <input type="text" placeholder="Label" /></label>
- Table:
  <table>
    <tr><th>Header 1</th><th>Header 2</th></tr>
    <tr><td>Cell 1</td><td>Cell 2</td></tr>
  </table>
- Checkbox: <label><input type="checkbox" /> Label</label>
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
    res
      .status(500)
      .send({ status: "error", message: "Failed to generate UI." });
  }
});

exports.generateUI = functions.https.onRequest(app);
