✅ Step-by-Step: Run the AI UI Generator Project
You only need to follow these steps once to set everything up.

🗂️ Step 1: Folder Setup
Create a new folder (e.g. requirement-to-ui-generator)

Inside it, add these two folders:

pgsql
Copy
Edit
frontend/    ← React App
functions/   ← Firebase Cloud Functions
📌 Paste the code I gave you earlier into the correct files:

functions/index.js, functions/package.json

frontend/src/App.js, frontend/src/App.css, frontend/src/index.js

frontend/public/index.html

Top-level firebase.json, .firebaserc

🔧 Step 2: Initialize Firebase
In your project root folder (requirement-to-ui-generator), run:

bash
Copy
Edit
firebase init
When prompted:

✔ Select: Functions, Hosting

Select JavaScript for Functions

Choose functions folder

Select "frontend/build" for Hosting public directory

Don’t overwrite existing files

🧠 Step 3: Install Dependencies
For Firebase Functions:
bash
Copy
Edit
cd functions
npm install
For Frontend (React):
bash
Copy
Edit
cd ../frontend
npm install
🛠 Step 4: Build the React App
bash
Copy
Edit
npm run build
This builds your React app into frontend/build/ — needed for Firebase Hosting.

🚀 Step 5: Deploy Everything
Go back to the root folder and run:

bash
Copy
Edit
firebase deploy