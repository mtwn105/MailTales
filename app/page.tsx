"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { motion } from "framer-motion";
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
      {/* <BackgroundBeams className="-z-10" /> */}
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
          className="text-4xl px-4  lg:text-6xl font-bold  max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
        >
          Turn Emails into{" "}
          <br />
          <Highlight className="text-black dark:text-white">
            Captivating Stories
          </Highlight>
        </motion.h1>
        <Button
          className="h-12 w-48  text-white shadow-lg font-bold mt-8"
          onClick={goToSignUp}
        >
          Get Started
        </Button>
      </HeroHighlight>
      {/* <div className="w-full mx-auto text-center">
        <p className="fade-in-up text-4xl sm:text-7xl font-bold relative z-20  py-8 animate-fade-in  md:text-7xl  bg-clip-text   text-center font-sans ">
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
      </div> */}
    </main>
  );
}
