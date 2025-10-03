"use client"
import Navbar from "@components/base components/Navbar";
import Footer from "@components/base components/Footer";
import Profile from "@components/profile components/Profile";

export default function ProfilePage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Navbar />
      <Profile />
      <Footer />
    </div>
  );
}
