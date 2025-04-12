
"use client";

import { useState } from "react";
import { ClipLoader } from "react-spinners";
import jsPDF from "jspdf";
import Link from "next/link";

export default function GenerateResume() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedin: "",
    phone: "",
    university: "",
    graduationStart: "",
    graduationEnd: "",
    currentGPA: "",
    education: "",
    skills: "",
    experience: "",
    certifications: "",
    strengths: "",
    projects: "",
    achievements: "",
  });

  const [resumeContent, setResumeContent] = useState("");
  const [suggestionsContent, setSuggestionsContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedResumeContent, setEditedResumeContent] = useState(""); // New state for edited content

  const escapeHTML = (text) => {
    return text
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/\n/g, "<br>");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setShowResults(false);

    const prompt = `
Create a detailed, structured resume based on the following details. 
1. Include a clear professional summary at the top.
2. For the experience section, describe the responsibilities in depth, including specific skills and tools used.
3. For each project, provide an overview of the impact and challenges faced.
4. Expand on the achievements, with metrics and concrete examples of success.
Then, clearly list exactly 3 improvement suggestions under the heading 'Suggestions'.

Name: ${formData.name}
Email: ${formData.email}
Linkedin: ${formData.linkedin}
Phone: ${formData.phone}
University: ${formData.university}
Graduation Start: ${formData.graduationStart}
Graduation End: ${formData.graduationEnd}
Current GPA: ${formData.currentGPA}
Education: ${formData.education}
Skills: ${formData.skills}
Experience: ${formData.experience}
Certifications: ${formData.certifications}
Strengths: ${formData.strengths}
Projects: ${formData.projects}
Achievements: ${formData.achievements}
`;

    try {
      const response = await fetch("https://api.cohere.ai/v1/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "command",
          prompt: prompt,
          max_tokens: 1300,
          temperature: 0.6,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API request failed with status ${response.status}: ${errorData.message || "Unknown error"}`
        );
      }

      const result = await response.json();
      const text = result.generations?.[0]?.text || "AI did not return a result.";

      const splitIndex = text.toLowerCase().indexOf("suggestion");
      const resumeText = splitIndex !== -1 ? text.slice(0, splitIndex).trim() : text.trim();
      const suggestionText = splitIndex !== -1 ? text.slice(splitIndex).trim() : "No suggestions provided.";

      setResumeContent(resumeText);
      setEditedResumeContent(resumeText); // Initialize edited content
      setSuggestionsContent(suggestionText);
      setShowResults(true);
      setIsEditing(false); // Reset edit mode
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(`Failed to generate resume: ${error.message}`);
      setResumeContent("");
      setEditedResumeContent("");
      setSuggestionsContent("");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate PDF using jsPDF
  const handleDownload = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    const maxWidth = pageWidth - 2 * margin;
    let y = margin;

    const addSection = (title, content, isSubSection = false) => {
      // Add section or subsection title
      doc.setFont("courier", "bold");
      doc.setFontSize(isSubSection ? 12 : 14);
      doc.setTextColor(0, 0, 0); // Black color
      doc.text(title, margin, y);
      const titleWidth = doc.getTextWidth(title);
      doc.setLineWidth(0.2);
      doc.line(margin, y + 1, margin + titleWidth, y + 1); // Underline
      y += isSubSection ? 6 : 8;

      // Add section content
      if (content.trim()) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0); // Reset to black
        const lines = doc.splitTextToSize(content, maxWidth);
        lines.forEach((line) => {
          if (y + 6 > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += 6;
        });
      }
      y += 6; // Space after section
    };

    // Document title
    doc.setFont("courier", "bold");
    doc.setFontSize(16);
    doc.text("My Resume", margin, y);
    y += 10;

    // Clean resumeContent by removing introductory line
    let cleanedResumeContent = editedResumeContent.replace(
      /Here is a structured resume for .*? based on the details provided:/i,
      ""
    ).trim();

    // Split resumeContent into sections
    const resumeSections = cleanedResumeContent.split(
      /\n\s*(?=(?:Professional Summary|Experience|Education|Skills|Certifications|Achievements|Projects)\b)/i
    );
    resumeSections.forEach((section) => {
      const lines = section.trim().split("\n");
      const title = lines[0].trim();
      const content = lines.slice(1).join("\n").trim();

      // Check if the title is "Achievements" or "Projects" for semi-bold
      const isSubSection = ["Achievements", "Projects"].some((t) =>
        title.toLowerCase().startsWith(t.toLowerCase())
      );
      addSection(title, content, isSubSection);
    });

    doc.save("My_AI_Resume.pdf");
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    if (isEditing) {
      // Save changes when exiting edit mode
      setEditedResumeContent(editedResumeContent);
    }
  };

  const handleResumeEdit = (e) => {
    setEditedResumeContent(e.target.value);
  };

  const shareText = encodeURIComponent(
    `Check out my AI-generated resume!\n${resumeContent.substring(0, 150)}...`
  );
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=https://yourwebsite.com&summary=${shareText}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;

  return (
    <div
      className={`flex flex-col justify-center items-center min-h-screen ${
        isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-black"
      }`}
    >
      <Link
        href="/"
        className={`absolute top-4 left-4 text-[11px] font-sans border rounded-md p-2 hover:bg-[#2a2a2a] ${
          isDarkMode ? "border-gray-600 hover:bg-[#2a2a2a]" : "border-gray-900 hover:bg-gray-200"
        }`}
      >
        Back to Home
      </Link>
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 text-[11px] font-mono border rounded-md p-2 transition-colors duration-200 ${
          isDarkMode
            ? "border-gray-600 hover:bg-[#2a2a2a] text-white"
            : "border-gray-900 hover:bg-gray-200 text-black"
        }`}
      >
        {isDarkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <h1 className="text-center mt-9 text-2xl font-mono">AI Powered Resume Builder</h1>
      <p className="text-center mt-2 text-[11px] font-mono">
        Generate resume in seconds and apply for jobs
      </p>

      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-3xl p-8 rounded-2xl shadow-lg mx-4 mt-8 flex flex-col gap-4 ${
          isDarkMode ? "bg-[#1e1e1e]" : "bg-white"
        }`}
      >
        {Object.entries(formData).map(([key, value]) => (
          <input
            key={key}
            name={key}
            value={value}
            onChange={handleChange}
            className={`border text-sm p-3 rounded-md placeholder:font-mono text-[11px] ${
              isDarkMode
                ? "border-gray-600 bg-[#2a2a2a] text-white placeholder:text-gray-400"
                : "border-gray-800 bg-white text-gray-900 placeholder:text-gray-800"
            }`}
            placeholder={
              key === "graduationStart"
                ? "Graduation Start Date (e.g., Aug 2022)"
                : key === "graduationEnd"
                ? "Expected Graduation Date (e.g., May 2026)"
                : key.replace(/([A-Z])/g, " $1").toLowerCase()
            }
            type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
            required={key === "name" || key === "email"}
          />
        ))}
        <button
          type="submit"
          disabled={isLoading}
          className={`border rounded-md text-[11px] font-mono p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            isDarkMode ? "border-gray-600 hover:bg-[#2a2a2a]" : "border-gray-900 hover:bg-gray-200"
          }`}
        >
          {isLoading ? "Generating..." : "Generate Resume"}
        </button>
      </form>

      {errorMessage && (
        <div className="mt-8 text-red-400 text-[11px] font-mono">{errorMessage}</div>
      )}

      {isLoading && (
        <div className="mt-8">
          <ClipLoader color={isDarkMode ? "#fff" : "#000"} size={50} />
        </div>
      )}

      {showResults && (
        <div
          className={`w-full max-w-3xl mx-4 mt-8 p-8 rounded-2xl shadow-lg ${
            isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-black"
          }`}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-mono">Your Resume</h2>
            <button
              onClick={handleEditToggle}
              className={`text-[11px] font-mono border rounded-md p-2 cursor-pointer ${
                isDarkMode
                  ? "border-gray-600 hover:bg-[#2a2a2a] text-white"
                  : "border-gray-900 hover:bg-gray-200 text-black"
              }`}
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
          {isEditing ? (
            <textarea
              value={editedResumeContent}
              onChange={handleResumeEdit}
              className={`w-full h-96 mt-4 p-4 text-[11px] font-mono border rounded-md resize-y ${
                isDarkMode
                  ? "bg-[#2a2a2a] text-white border-gray-600"
                  : "bg-white text-black border-gray-800"
              }`}
            />
          ) : (
            <div
              className="mt-4 text-[11px] font-mono whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: escapeHTML(editedResumeContent) }}
            />
          )}
          <h2 className="text-xl font-mono mt-6">AI Suggestions</h2>
          <div
            className="mt-4 text-[11px] font-mono whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: escapeHTML(suggestionsContent) }}
          />
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleDownload}
              className={`border rounded-md text-[11px] font-mono p-2 cursor-pointer ${
                isDarkMode
                  ? "border-gray-600 hover:bg-[#2a2a2a] text-white"
                  : "border-gray-900 hover:bg-gray-200 text-black"
              }`}
            >
              Download PDF
            </button>
            <a
              href={linkedInShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`border rounded-md text-[11px] font-mono p-2 cursor-pointer ${
                isDarkMode
                  ? "border-gray-600 hover:bg-[#2a2a2a] text-white"
                  : "border-gray-900 hover:bg-gray-200 text-black"
              }`}
            >
              Share on LinkedIn
            </a>
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`border rounded-md text-[11px] font-mono p-2 cursor-pointer ${
                isDarkMode
                  ? "border-gray-600 hover:bg-[#2a2a2a] text-white"
                  : "border-gray-900 hover:bg-gray-200 text-black"
              }`}
            >
              Share on Twitter
            </a>
          </div>
        </div>
      )}
    </div>
  );
}