"use client";

import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import axios from "axios";
import useUserStore from "@/store/UserStore";
import { toast } from "sonner";
import { Code, Copy, Loader2 } from "lucide-react";

export default function CodeGenerator() {
  // Get user data and usage count from global store
  const { user, setUsageCount, usageCount } = useUserStore.getState();

  // State for input code
  const [code, setCode] = useState<string>(`function sum() {
  return 1 + 1;
}`);

  // State for generated code
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  // Loading state for async request
  const [loading, setLoading] = useState(false);

  // Highlight code when component mounts
  useEffect(() => {
    prism.highlightAll();
  }, []);

  // Function to generate reviewed code using AI
  async function generateCode() {
    setLoading(true);
    try {
      const response = await axios.post("/api/codeReview", {
        userId: user?.id, // ✅ Send userId in request
        messages: [
          { role: "user", content: `Please review this code:\n\n${code}` }, // ✅ Ask Gemini to review the code
        ],
      });

      if (
        response.data.error === "Free limit reached, please upgrade" ||
        usageCount >= 5
      ) {
        window.location.href = "/pricing"; // 🚀 Redirect to upgrade page
      } else {
        setGeneratedCode(response.data.content); // ✅ Extract reviewed code response
        setUsageCount(usageCount + 1);
      }
    } catch (error) {
      setGeneratedCode("❌ Error generating code review.");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  }

  // Function to copy generated code to clipboard
  function copyToClipboard() {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      toast.success("Code copied to clipboard");
    }
  }

  return (
    <main className="flex flex-col lg:flex-row gap-4 md:gap-6 w-full mx-auto p-3 sm:p-4 md:p-6 text-white min-h-screen">
      {/* Left Section: Code Input */}
      <div className="w-full lg:w-1/2 transition-all duration-300 ease-in-out">
        <div className="flex items-center gap-2 mb-3">
          <Code className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg sm:text-xl font-bold text-blue-400">
            Enter Your Code:
          </h2>
        </div>
        <div className="border border-gray-700 rounded-lg shadow-md p-2 bg-gray-800 hover:border-blue-500/50 transition-colors">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              prism.highlight(code, prism.languages.javascript, "javascript")
            }
            padding={12}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 14,
              minHeight: "250px",
              backgroundColor: "#1e1e1e",
              color: "#cfcfcf",
              borderRadius: "5px",
            }}
            className="custom-scrollbar"
          />
        </div>
        <button
          onClick={generateCode}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            "Analyze Code"
          )}
        </button>
      </div>

      {/* Right Section: Generated Code Output */}
      <div className="w-full lg:w-1/2 transition-all duration-300 ease-in-out mt-6 lg:mt-0">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-green-400" />
            <h2 className="text-lg sm:text-xl font-bold text-green-400">
              Generated Code:
            </h2>
          </div>
          {generatedCode && (
            <button
              onClick={copyToClipboard}
              className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded-md flex items-center gap-1 transition-colors">
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          )}
        </div>
        <div className="border border-gray-700 rounded-lg shadow-md p-4 bg-gray-800 min-h-[250px] hover:border-green-500/50 transition-colors overflow-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
          ) : generatedCode ? (
            <Markdown
              rehypePlugins={[rehypeHighlight]}
              className="prose prose-invert prose-sm sm:prose-base max-w-none">
              {generatedCode}
            </Markdown>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <Code className="w-10 h-10 mb-2 opacity-50" />
              <p>Generated code will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
