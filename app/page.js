"use client";

import Link from "next/link";
import { useState } from "react";
import WhyUs from "@/components/WhyUs";
import Footer from "@/components/Footer"; // ✅ Don't forget this!

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev); // ✅ This was missing!
  };

  return (
    <div
      className={`flex flex-col justify-center items-center min-h-screen transition-all duration-500 ease-in-out ${
        isDarkMode ? "bg-black text-white" : "bg-gray-100 text-black"
      }`}
    >
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 text-[11px] font-mono border rounded-md p-2 transition-all duration-300 ease-in-out ${
          isDarkMode
            ? "border-gray-600 text-white bg-[#1e1e1e] hover:bg-[#2a2a2a] hover:border-cyan-400"
            : "border-gray-900 text-black bg-white hover:bg-gray-200 hover:border-gray-700"
        }`}
      >
        {isDarkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <h1 className="text-center mt-9 text-2xl font-mono">AI Powered Resume Builder</h1>
      <p className="text-center mt-2 text-[11px] font-mono">
        Generate resume in seconds and apply for jobs
      </p>

      <Link href="/generateResume">
        <button
          className={`mt-8 border rounded-md text-[11px] font-mono p-2 cursor-pointer transition-all duration-300 ease-in-out ${
            isDarkMode
              ? "border-gray-600 text-white bg-[#1e1e1e] hover:bg-[#2a2a2a] hover:border-cyan-400"
              : "border-gray-900 text-black bg-white hover:bg-gray-200 hover:border-gray-700"
          }`}
        >
          Go to Resume Generator
        </button>
      </Link>

      <WhyUs isDarkMode={isDarkMode} />
      <Footer isDarkMode={isDarkMode} /> 
    </div>
  );
}
