import { cookies } from "next/headers";
import React from "react";
import dynamic from "next/dynamic";
// import PaymentSuccessUI from "@components/PaymentSuccessUI";

// Dynamically import the client UI component
const PaymentSuccessUI = dynamic(() => import("@components/PaymentSuccessUI"), {
  ssr: false, // This ensures hooks work on the client
});

export default async function PaymentSuccessPage({ params }) {
  const Ids = params.Ids; // expecting multiple IDs as comma-separated

  // Server-side enrollment logic

const cookieStore = cookies();
const user = cookieStore.get("user")?.value;
console.log('user from cookie', user, JSON.parse(user)._id);
  let status = false;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/enroll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: JSON.parse(user)._id, 
        courseIds: JSON.stringify(Ids),
      }),
    });

    const data = await res.json();
    if (data.status === "success") status = true;
  } catch (err) {
    console.error("Enrollment failed on server:", err);
  }

  // Pass initial status to client component
  return <PaymentSuccessUI initialStatus={status} />;
}
