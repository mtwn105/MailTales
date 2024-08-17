"use client";

import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

export default function Home() {
  // const handleClick = (e: any) => {
  //   e.preventDefault();
  //   // Call the API route to get the auth URL
  //   fetch("/api/auth", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((response) => {
  //       if (response.ok) {
  //         return response.json();
  //       } else {
  //         throw new Error("Failed to fetch data");
  //       }
  //     })
  //     .then((data) => {
  //       // Redirect the user to the auth URL
  //       console.log(data.authUrl);
  //       window.location.href = data.authUrl;
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // };

  // Get the router instance
  const router = useRouter();

  // Define the handler function
  const goToSignUp = () => {
    router.push("/sign-up"); // Replace with your target path
  };

  return (
    <main>
      <div className="w-full mx-auto text-center">
        <p className="fade-in-up text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8 animate-fade-in">
          Turn <span className="text-primary">Boring</span> Emails into{" "}
          <span className="text-secondary">Captivating Stories</span>
        </p>
        <Button
          radius="full"
          size="lg"
          color="secondary"
          variant="shadow"
          className=" text-white shadow-lg font-bold"
          onClick={goToSignUp}
        >
          Get Started
        </Button>
      </div>
    </main>
  );
}
