"use client";


const WhyUs = ({ isDarkMode }) => {
  return (
    <div className="flex flex-col justify-center items-center px-4  sm:px-6 mt-16">
      <h1 className="text-4xl font-mono font-semibold tracking-wide mb-8 text-center">
        Why Us?
      </h1>

      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 w-full max-w-6xl">
        {[ 
          "Make resumes that get you hired in just a few clicks.",
          "AI-powered resumes with enhanced and structured details.",
          "Easily create, edit, and download your resume on the platform."
        ].map((text, index) => (
          <div
            key={index}
            className={`w-full sm:w-[300px] border rounded-xl px-6 py-5 shadow-md transition-transform duration-300 ease-in-out transform hover:scale-[1.03] text-center ${
              isDarkMode
                ? "bg-[#1f1f1f] border-gray-600 text-white hover:bg-[#2a2a2a] hover:shadow-cyan-500/40"
                : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100 hover:shadow-gray-400/40"
            }`}
          >
            <p className="text-sm font-mono leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


export default WhyUs;