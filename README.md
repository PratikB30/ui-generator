
🗂️ Step 1: Folder Setup
Create a new folder (e.g. requirement-to-ui-generator)

Inside it, add these two folders:

frontend/    ← React App
functions/   ← Firebase Cloud Functions

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


🧠 Step 3: Install Dependencies
For Firebase Functions:

cd functions

npm install

For Frontend (React):
cd ../frontend
npm install

🛠 Step 4: Build the React App
npm run build
This builds your React app into frontend/build/ — needed for Firebase Hosting.

🚀 Step 5: Deploy Everything
Go back to the root folder and run:

bash
Copy
Edit
firebase deploy
