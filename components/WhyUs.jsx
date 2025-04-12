"use client";



const WhyUs = ({ isDarkMode }) => {
  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <h1 className="text-3xl font-mono mt-7">why us ?</h1>

      <div className="flex flex-row justify-evenly gap-4 max-w-3xl mt-9 p-1">
        <div
          className={`border rounded-lg p-4 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 ${
            isDarkMode
              ? "bg-gray-800 border-white text-white hover:bg-gray-700 hover:shadow-lg hover:shadow-cyan-500/50"
              : "bg-white border-gray-900 text-black hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-400/50"
          }`}
        >
          <p className="text-sm font-mono">
            make resumes that get you hired just in few clicks
          </p>
        </div>
        <div
          className={`border rounded-lg p-4 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 ${
            isDarkMode
              ? "bg-gray-800 border-white text-white hover:bg-gray-700 hover:shadow-lg hover:shadow-cyan-500/50"
              : "bg-white border-gray-900 text-black hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-400/50"
          }`}
        >
          <p className="text-sm font-mono">
            ai powered resume with enhanced and structured details
          </p>
        </div>
        <div
          className={`border rounded-lg p-4 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 ${
            isDarkMode
              ? "bg-gray-800 border-white text-white hover:bg-gray-700 hover:shadow-lg hover:shadow-cyan-500/50"
              : "bg-white border-gray-900 text-black hover:bg-gray-200 hover:shadow-xl hover:shadow-gray-400/50"
          }`}
        >
          <p className="text-sm font-mono">
            easy to create , edit and download the resume on the platform itself
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhyUs;