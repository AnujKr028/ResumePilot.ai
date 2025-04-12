"use client";

import React from "react";

const Footer = ({ isDarkMode }) => {
  return (
    <footer
      className={`w-full max-w-4xl px-6 py-4 mx-auto mt-10 border-t ${
        isDarkMode ? "border-gray-700 text-gray-300" : "border-gray-300 text-gray-700"
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center text-xs font-mono gap-3">
        <div className="flex gap-4">
          <a
            href="https://www.linkedin.com/in/anuj-kumar-3a3242359/"
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:underline ${
              isDarkMode ? "hover:text-cyan-400" : "hover:text-blue-600"
            }`}
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/AnujKr028"
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:underline ${
              isDarkMode ? "hover:text-cyan-400" : "hover:text-blue-600"
            }`}
          >
            GitHub
          </a>
        </div>

        <p className="mt-2 sm:mt-0">Made by Anuj © 2025</p>
      </div>
    </footer>
  );
};

export default Footer;
