import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import Word from "./Word";

export default function ScrollTextAnimation() {
  const scrollContainerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
  });

  const text =
    "With our simple and easy to use application, you'll be able to keep track of all of your medications in one place. You'll be one step closer to never forgetting to take your medicine again. All you need to get started is your gmail account and your phone. It's time to get notified. Want to find out more? We've laid out our five step process below.";

  const words = text.split(" ");

  return (
    <>
      <motion.div
        className="min-h-[150vh] bg-gray-dark p-10 sm:p-10 lg:p-56"
        ref={scrollContainerRef}
      >
        <p className="top-0 py-5 text-5xl font-bold leading-tight text-white">
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
