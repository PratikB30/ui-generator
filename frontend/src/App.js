import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { Input } from "./components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Upload, FileText, Sparkles, Loader2, AlertCircle, Code, Eye } from "lucide-react";
import "./App.css";
import "./markdown.css";

function App() {
  const [requirement, setRequirement] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("ui"); // "ui" or "markdown"

  const handleSubmit = async () => {
    if (!requirement.trim()) {
      setError("Please enter a requirement before generating UI.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://us-central1-ui-generator-d7f03.cloudfunctions.net/generateUI/generate-ui",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requirement }),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setMarkdown(data.markdown);
      } else {
        setError(data.message || "Unknown error");
      }
    } catch (err) {
      console.error("Backend connection error:", err);
      setError(
        "Failed to connect to backend. Please check if the Firebase Functions emulator is running on port 5001."
      );
    }
    setLoading(false);
  };

  const extractPDFText = async (arrayBuffer) => {
    // @ts-ignore - pdfjsLib is loaded from CDN
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer })
      .promise;
    const textContent = [];

    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      let lastY = null;
      let textLine = [];

      // Process each text item
      for (const item of content.items) {
        if (lastY !== item.transform[5]) {
          if (textLine.length > 0) {
            textContent.push(textLine.join(" "));
            textLine = [];
          }
          lastY = item.transform[5];
        }
        textLine.push(item.str);
      }

      // Add the last line
      if (textLine.length > 0) {
        textContent.push(textLine.join(" "));
      }

      // Add page break if not last page
      if (i < pdf.numPages) {
        textContent.push("\n\n--- Page Break ---\n\n");
      }
    }

    return textContent.join("\n");
  };

  const extractWordText = async (arrayBuffer) => {
    try {
      // @ts-ignore - mammoth is loaded from CDN
      const result = await window.mammoth.extractRawText({ arrayBuffer });
      if (result.messages.length > 0) {
        console.log("Mammoth messages:", result.messages);
      }
      return result.value;
    } catch (err) {
      console.error("Word document parsing error:", err);
      throw new Error(
        "Failed to parse Word document. Please ensure it's a valid .docx file."
      );
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      let text = "";
      setLoading(true);
      setError("");

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File is too large. Maximum size is 10MB.");
      }

      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        text = await extractPDFText(arrayBuffer);
      } else if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.toLowerCase().endsWith(".docx")
      ) {
        const arrayBuffer = await file.arrayBuffer();
        text = await extractWordText(arrayBuffer);
      } else if (file.type.startsWith("text/")) {
        text = await file.text();
      } else {
        throw new Error(
          `Unsupported file type: ${file.type}. Please upload a PDF, Word document (.docx), or text file.`
        );
      }

      // Clean up the extracted text
      text = text
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .replace(/\n\s*\n/g, "\n\n") // Replace multiple newlines with double newline
        .trim(); // Remove leading/trailing whitespace

      if (!text.trim()) {
        throw new Error(
          "No text could be extracted from the file. Please ensure the file contains text content."
        );
      }

      setRequirement(text);
    } catch (err) {
      setError(`Failed to read file: ${err.message}`);
      console.error("File reading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setRequirement("");
    setMarkdown("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI UI Generator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your requirements into beautiful, functional UI components
            with the power of AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Requirements Input
              </CardTitle>
              <CardDescription>
                Describe your UI requirements or upload a file (PDF, Word, or
                text) containing your specifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Requirements</label>
                <Textarea
                  placeholder="Describe your UI requirements here... For example: Create a login form with email and password fields, a remember me checkbox, and a submit button..."
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  rows={12}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Or upload a file</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".txt,.md,.pdf,.docx"
                    className="flex-1"
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !requirement.trim()}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate UI
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearAll}
                  disabled={!requirement && !markdown}
                >
                  Clear
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generated UI
                </CardTitle>
                {markdown && (
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "ui" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("ui")}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      UI View
                    </Button>
                    <Button
                      variant={viewMode === "markdown" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("markdown")}
                    >
                      <Code className="h-4 w-4 mr-1" />
                      Markdown
                    </Button>
                  </div>
                )}
              </div>
              <CardDescription>
                {markdown 
                  ? (viewMode === "ui" 
                      ? "Preview of the generated UI components" 
                      : "Raw markdown output from the AI")
                  : "Preview the generated UI components and code"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {markdown ? (
                <div className="prose prose-sm max-w-none">
                  {viewMode === "ui" ? (
                    <div className="markdown-content">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        className="prose-headings:text-foreground prose-p:text-muted-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:p-4"
                      >
                        {markdown}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <pre className="bg-slate-100 p-4 rounded-lg overflow-x-auto border border-slate-200">
                      <code className="text-slate-900 whitespace-pre-wrap">{markdown}</code>
                    </pre>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-600 mb-2">Generated UI will appear here</p>
                  <p className="text-sm text-gray-500">
                    Enter your requirements and click "Generate UI" to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Built by 1PX Labs</p>
        </div>
      </div>
    </div>
  );
}

export default App;
