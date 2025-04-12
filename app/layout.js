

// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css"; // Assuming you have global styles

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Resume Builder",
  description: "Generate professional resumes with AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}