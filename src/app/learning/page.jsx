"use client"
import Navbar from "@components/base components/Navbar";
import Footer from "@components/base components/Footer";
import Learning from "@components/base components/Learning";

export default function LearningPage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Navbar />
      <Learning />
      <Footer />
    </div>
  );
}
