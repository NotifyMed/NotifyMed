import Typewriter from "typewriter-effect";
import ScrollTextAnimation from "@/components/landing/ScrollTextAnimation";
import { useRef } from "react";
import HowItWorks from "@/components/landing/HowItWorks";
import { handleScrollToSection } from "@/utils/handleScrollToSection";
import { HiChevronDoubleDown, HiChevronDoubleRight } from "react-icons/hi";
import Link from "next/link";

export default function Home() {
  const howItWorksRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-gray-dark">
      <section className="max-w-7xl mx-auto mt-5 px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-24 font-roboto min-h-screen ">
        <div className="text-center">
          <h1 className="text-5xl font-bold">
            Welcome to Notify Med {""}
            <span role="img" aria-label="Waving hand emoji">
              👋
            </span>
          </h1>
        </div>
        <div className="text-2xl text-left mt-5">
          Notify Med is a {""}
          <span className="sm:[&>div]:inline">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .pauseFor(1000)
                  .typeString("medication tracker")
                  .pauseFor(300)
                  .deleteAll()
                  .typeString("medication reminder")
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
            aria-label="Scroll to how it works"
          >
            <HiChevronDoubleDown className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform" />
          </button>
        </div>
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div className="flex flex-col justify-center items-center mt-10">
          <div className="w-full max-w-sm  shadow bg-gray-dark">
            <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              It&#39;s time to get notified.
            </h2>

            <p className="mb-3 text-gray-500 dark:text-gray-400">
              Never miss a medication again. On time, every time.
            </p>
            <Link
              href="http://localhost:3000/api/auth/signin?callbackUrl="
              className="text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            >
              Get Started <HiChevronDoubleRight className="inline" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
