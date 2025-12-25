"use client"
import Navbar from "@components/base components/ModernNavbar";
import Footer from "@components/base components/Footer";
import ModernAuth from "@components/auth/ModernAuth";
import { useEffect, useState } from "react";

export default function AuthenticationPage({params}) {
  console.log('iddddddddddddddddddddd', params.type)
    const [type, setAuthType] = useState("login");

    useEffect(()=>{
      setAuthType(params.type)
    },[params.type])
  return (
    <div className="w-full flex flex-col min-h-screen">
      <ModernAuth type={type} setAuthType={setAuthType}/>
    </div>
  );
}
