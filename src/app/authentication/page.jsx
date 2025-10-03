"use client"
import Navbar from "@components/base components/Navbar";
import Footer from "@components/base components/Footer";
import Authentication from "@components/base components/Authentication";
import { useState } from "react";

export default function AuthenticationPage() {
    const [type, setAuthType] = useState("login");
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Navbar />
      <Authentication type={type} setAuthType={setAuthType}/>
      <Footer />
    </div>
  );
}
