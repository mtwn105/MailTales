"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { GoogleSignUpButton } from "@/components/ui/google-button";

// import React, { useState } from "react";
export default function SignUp() {
  // const [name, setName] = useState("");

  // Call Auth
  const authStart = (e: any) => {
    e.preventDefault();
    // Call the API route to get the auth URL
    fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch data");
        }
      })
      .then((data) => {
        // Redirect the user to the auth URL
        console.log(data.authUrl);
        window.location.href = data.authUrl;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <main>
      <BackgroundBeams className="-z-10" />
      <div className="w-full mx-auto text-center">
        <p className="fade-in-up text-4xl sm:text-5xl font-bold relative z-20 bg-clip-text py-8 animate-fade-in">
          Get Started with MailTales
        </p>
        <GoogleSignUpButton onClick={authStart} />
        {/* <span>Aceternity UI</span> */}
        {/* </HoverBorderGradient> */}
      </div>
    </main>
  );
}
