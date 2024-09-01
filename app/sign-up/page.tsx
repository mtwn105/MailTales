"use client";

import { GoogleSignUpButton } from "@/components/ui/google-button";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { motion } from "framer-motion";
import Image from "next/image";
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
      <HeroHighlight className="text-center">
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-3xl px-4  lg:text-5xl font-bold  max-w-3xl leading-relaxed lg:leading-snug text-center mx-auto "
        >
          Get Started with
        </motion.h1>
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-4xl px-4  lg:text-6xl font-bold  max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
        >
          <Image
            src="/logo.png"
            alt="MailTales"
            width={400}
            height={300}
            className="inline-block"
          />
        </motion.h1>
        <div className="mt-2">
          <GoogleSignUpButton onClick={authStart} />
        </div>
      </HeroHighlight>
    </main>
  );
}
