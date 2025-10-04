"use client"
import Navbar from "@components/base components/Navbar";
import Footer from "@components/base components/Footer";
import Authentication from "@components/base components/Authentication";
import { useEffect, useState } from "react";

export default function AuthenticationPage({params}) {
  console.log('iddddddddddddddddddddd', params.type)
    const [type, setAuthType] = useState("login");

    useEffect(()=>{
      setAuthType(params.type)
    },[params.type])
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Navbar onFocusNavigate={true}/>
      <Authentication type={type} setAuthType={setAuthType}/>
      <Footer />
    </div>
  );
}
