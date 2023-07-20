import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import Word from "./Word";

export default function ScrollTextAnimation() {
  const scrollContainerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
  });

  const text =
    "Never miss a medication again. With our simple and easy to use application, you'll be able to keep track of all of your medications in one place. All you need to get started is your gmail account and your phone. It's time to get notified. Want to find out more? We've laid out our five step process below.";

  const words = text.split(" ");

  return (
    <>
      <motion.div
        className="min-h-[150vh] bg-black p-10 sm:p-10 lg:p-56"
        ref={scrollContainerRef}
      >
        <p className="sticky top-0 py-20 text-5xl font-bold leading-tight text-white">
          {words.map((word, index) => (
            <Word
              key={index}
              scrollYProgress={scrollYProgress}
              index={index}
              word={word}
              totalWords={words.length}
            />
          ))}
        </p>
      </motion.div>
    </>
  );
}
