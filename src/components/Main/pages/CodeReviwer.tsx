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
    <main className="flex flex-col gap-6 w-full mx-auto p-6 text-white  min-h-screen">
      {/* Left Section: Code Input */}
      <div className="left w-full ">
        <h2 className="text-xl font-bold mb-2 text-blue-400">
          Enter Your Code:
        </h2>
        <div className="border border-gray-700 rounded-lg shadow-md p-2 bg-gray-800">
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
              minHeight: "200px",
              backgroundColor: "#1e1e1e",
              color: "#cfcfcf",
              borderRadius: "5px",
            }}
          />
        </div>
        <button
          onClick={generateCode}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-all">
          {loading ? "Analyzing..." : "Analyze Code"}
        </button>
      </div>

      {/* Right Section: Generated Code Output */}
      <div className=" w-full">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-green-400">Generated Code:</h2>
          {generatedCode && (
            <button
              onClick={copyToClipboard}
              className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded-md">
              Copy
            </button>
          )}
        </div>
        <div className="border border-gray-700 rounded-lg shadow-md p-4 bg-gray-800 min-h-[200px]">
          {generatedCode ? (
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {generatedCode}
            </Markdown>
          ) : (
            <p className="text-gray-500">Generated code will appear here.</p>
          )}
        </div>
      </div>
    </main>
  );
}
