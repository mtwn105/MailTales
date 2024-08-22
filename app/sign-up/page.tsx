"use client";

import { Button } from "@nextui-org/button";
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
      <div className="w-full mx-auto text-center">
        <p className="fade-in-up text-4xl sm:text-5xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8 animate-fade-in">
          Get Started with MailTales
        </p>
        <Button
          className="text-white  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2 mt-4"
          onClick={authStart}
        >
          {/* <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
        > */}
          <svg
            aria-hidden="true"
            className="mr-2 -ml-1 w-4 h-4"
            data-icon="google"
            data-prefix="fab"
            focusable="false"
            role="img"
            viewBox="0 0 488 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              fill="currentColor"
            />
          </svg>
          {/* Sign up with Google */}
          <span>Sign up with Google</span>
        </Button>
        {/* <span>Aceternity UI</span> */}
        {/* </HoverBorderGradient> */}
      </div>
    </main>
  );
}
