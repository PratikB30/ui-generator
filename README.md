# AI UI Generator

A powerful AI-driven application that transforms requirements into beautiful UI components using React, Tailwind CSS, and Firebase Functions.

## 🚀 Features

- **AI-Powered UI Generation**: Uses Google's Gemini AI to convert requirements into UI components
- **Beautiful Frontend**: Modern React app with Tailwind CSS and shadcn/ui components
- **Firebase Backend**: Serverless functions for AI processing
- **File Upload**: Support for uploading requirement documents
- **Real-time Preview**: See generated UI components instantly
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, shadcn/ui, Lucide React
- **Backend**: Firebase Functions, Express.js
- **AI**: Google Generative AI (Gemini)
- **Styling**: Tailwind CSS with custom design system

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- Google AI API Key

## 🚀 Quick Start

### Option 1: Run Everything at Once (Recommended)

```bash
# Install all dependencies
npm run install-deps

# Start both frontend and backend
npm run dev
```

### Option 2: Run Services Separately

```bash
# Terminal 1: Start the backend (Firebase Functions)
npm run start:backend

# Terminal 2: Start the frontend
npm run start
```

### Option 3: Manual Setup

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../functions && npm install

# Start backend (Terminal 1)
cd .. && firebase emulators:start --only functions

# Start frontend (Terminal 2)
cd frontend && npm start
```

## 🌐 Access Points

- **Frontend**: http://localhost:5002
- **Backend**: http://localhost:5001
- **Firebase Emulator UI**: http://localhost:4000

## 🔧 Configuration

### API Key Setup

1. Get your Google AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update the API key in `functions/index.js`:
   ```javascript
   const genAI = new GoogleGenerativeAI("YOUR_API_KEY_HERE");
   ```

### Port Configuration

- Frontend runs on port 5002 (configurable in `frontend/package.json`)
- Backend runs on port 5001 (Firebase Functions emulator)

## 📝 Usage

1. **Enter Requirements**: Type your UI requirements in the text area
2. **Upload File**: Or upload a file containing your requirements
3. **Generate UI**: Click "Generate UI" to create components
4. **View Results**: See the generated UI components in the preview panel

## 🎨 Features

- **Modern Design**: Beautiful gradient backgrounds and professional styling
- **Responsive Layout**: Works perfectly on desktop and mobile
- **Loading States**: Smooth animations and feedback
- **Error Handling**: Clear error messages and validation
- **File Support**: Upload .txt, .md, .doc, .docx files
- **Markdown Rendering**: Rich preview of generated components

## 🏗️ Project Structure

```
requirement-to-ui-generator/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/ui/   # shadcn/ui components
│   │   ├── lib/            # Utility functions
│   │   └── App.js          # Main application
│   └── package.json
├── functions/               # Firebase Functions backend
│   ├── index.js            # AI processing logic
│   └── package.json
└── package.json            # Root configuration
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Conflicts**: If port 5001 or 5002 is in use, the services will automatically use the next available port
2. **API Key Issues**: Ensure your Google AI API key is valid and has sufficient credits
3. **Firebase CLI**: Make sure Firebase CLI is installed globally (`npm install -g firebase-tools`)

### Development Commands

```bash
# Install all dependencies
npm run install-deps

# Start development environment
npm run dev

# Build for production
npm run build

# Start only frontend
npm run start

# Start only backend
npm run start:backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using React, Tailwind CSS, and Firebase Functions**
