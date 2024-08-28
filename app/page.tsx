"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  // Get the router instance
  const router = useRouter();

  // Define the handler function
  const goToSignUp = () => {
    router.push("/sign-up"); // Replace with your target path
  };

  return (
    <main>
      <div className="w-full mx-auto text-center">
        <p className="fade-in-up text-4xl sm:text-7xl font-bold relative z-20  py-8 animate-fade-in">
          Turn <span className="">Boring</span> Emails into{" "}
          <span className="">Captivating Stories</span>
        </p>
        <Button
          size="lg"
          className=" text-white shadow-lg font-bold"
          onClick={goToSignUp}
        >
          Get Started
        </Button>
      </div>
    </main>
  );
}
