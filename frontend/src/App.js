import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { Input } from "./components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Upload, FileText, Sparkles, Loader2, AlertCircle } from "lucide-react";
import "./App.css";

function App() {
  const [requirement, setRequirement] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!requirement.trim()) {
      setError("Please enter a requirement before generating UI.");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "http://localhost:5001/ui-generator-d7f03/us-central1/generateUI/generate-ui",
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
      setError("Failed to connect to backend. Please check if the Firebase Functions emulator is running on port 5001.");
    }
    setLoading(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setRequirement(e.target.result);
      reader.readAsText(file);
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
            Transform your requirements into beautiful, functional UI components with the power of AI
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
                Describe your UI requirements or upload a file containing your specifications
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
                    accept=".txt,.md,.doc,.docx"
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
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Generated UI
              </CardTitle>
              <CardDescription>
                Preview the generated UI components and code
              </CardDescription>
            </CardHeader>
            <CardContent>
              {markdown ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown 
                    children={markdown} 
                    rehypePlugins={[rehypeRaw]} 
                    remarkPlugins={[remarkGfm]}
                    className="prose-headings:text-foreground prose-p:text-muted-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:p-4"
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generated UI will appear here</p>
                  <p className="text-sm">Enter your requirements and click "Generate UI" to get started</p>
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
