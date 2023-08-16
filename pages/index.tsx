import Link from "next/link";
import { NextSeo } from "next-seo";
import { HiChevronDoubleDown, HiChevronDoubleRight } from "react-icons/hi";
import { useRef } from "react";
import Typewriter from "typewriter-effect";
import HowItWorks from "@/components/landing/HowItWorks";
import ScrollTextAnimation from "@/components/landing/ScrollTextAnimation";
import { handleScrollToSection } from "@/utils/handleScrollToSection";

export default function Home() {
  const howItWorksRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-gray-dark">
      <NextSeo
        title="Notify Med - Medication Tracker and Reminder"
        description="Never forget to take your medication again!"
        canonical="https://notifymed.com/"
        openGraph={{
          url: "https://notifymed.com/",
          title: "Notify Med - Medication Tracker and Reminder",
          description: "Never miss a medication again!",
          site_name: "Notify Med",
          type: "website",
          locale: "en_US",
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content: "medication, reminder, tracker,",
          },
          {
            name: "author",
            content: "Notify Med",
          },
          {
            property: "og:type",
            content: "website",
          },
          {
            property: "og:locale",
            content: "en_US",
          },
          {
            property: "og:site_name",
            content: "Notify Med",
          },
        ]}
      />
      <section className="max-w-7xl mx-auto mt-5 px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-24 font-roboto min-h-screen ">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white">
            Welcome to Notify Med {""}
            <span role="img" aria-label="Waving hand emoji">
              👋
            </span>
          </h1>
        </div>
        <p className="mt-5 text-lg text-center text-white">
          Disclaimer: This application is not intended to be used as medical
          advice. We are simply a medication tracker and reminder.
        </p>
        <div className="text-2xl text-left mt-5 text-white">
          <span className="sm:[&>div]:inline">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .pauseFor(1000)
                  .typeString("Notify Med")
                  .pauseFor(300)
                  .deleteAll()
                  .typeString("Medication Tracker")
                  .pauseFor(300)
                  .deleteAll()
                  .typeString("Medication Reminder")
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
        <div id="pricing" className="text-center my-10 text-white">
          <div className="text-2xl sm:text-4xl text-bold mt-4 ">Pricing</div>
          <div className="text-lg sm:text-xl mt-4">
            Just kidding, Notify Med is completely free.
          </div>
          <div className="text-lg sm:text-xl leading-2">Let us help!</div>
        </div>
        <div
          className="flex items-center justify-center mb-10 text-white"
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
            <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-white ">
              On time, every time.
            </h2>

            <p className="mb-3 text-gray-500">Never miss a medication again.</p>
            <Link
              href="/login"
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
