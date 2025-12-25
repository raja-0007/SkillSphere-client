"use client"
import Navbar from "@components/base components/ModernNavbar";
import Footer from "@components/base components/ModernFooter";
import Dashboard from "@components/dashboard/Dashboard";

export default function LearningPage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Navbar onFocusNavigate={true}/>
      <Dashboard />
      <Footer />
    </div>
  );
}
