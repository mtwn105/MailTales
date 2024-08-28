"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
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
      <BackgroundBeams className="-z-10" />
      <div className="w-full mx-auto text-center">
        <p className="fade-in-up text-4xl sm:text-7xl font-bold relative z-20  py-8 animate-fade-in  md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans ">
          Turn <span className="">Boring</span> Emails into{" "}
          <span className="">Captivating Stories</span>
        </p>
        <Button
          size="lg"
          className=" text-white shadow-lg font-bold relative z-20"
          onClick={goToSignUp}
        >
          Get Started
        </Button>
      </div>
    </main>
  );
}
