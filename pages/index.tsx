import Image from "next/image";
import { Inter } from "next/font/google";
import Typewriter from "typewriter-effect";
import ScrollTextAnimation from "@/components/landing/ScrollTextAnimation";
import { useRef } from "react";
import HowItWorks from "@/components/landing/HowItWorks";
import { handleScrollToSection } from "@/utils/handleScrollToSection";
import { HiChevronDoubleDown } from "react-icons/hi";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const howItWorksRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <section className="max-w-7xl mx-auto mt-5 px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-24 font-roboto min-h-screen">
        <div className="text-center">
          <h1 className="text-5xl font-bold">
            Welcome to Notify Med {""}
            <span role="img" aria-label="Waving hand emoji">
              👋
            </span>
          </h1>
        </div>

        <div className="text-2xl text-center mt-5">
          Notify Med is a {""}
          <span className="sm:[&>div]:inline">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .pauseFor(1000)
                  .typeString("medication tracker")
                  .pauseFor(300)
                  .deleteAll()
                  .typeString("medication reminder application")
                  .pauseFor(300)
                  .deleteAll()
                  .start();
              }}
              options={{
                autoStart: true,
                loop: true,
                delay: 75,
              }}
            />
          </span>
        </div>

        <ScrollTextAnimation />
        <div
          className="flex items-center justify-center mb-10"
          ref={howItWorksRef}
        >
          <button
            onClick={handleScrollToSection(howItWorksRef)}
            aria-label="Scroll to meet the coach"
          >
            <HiChevronDoubleDown className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform" />
          </button>
        </div>

        <HowItWorks />
      </section>
    </>
  );
}
