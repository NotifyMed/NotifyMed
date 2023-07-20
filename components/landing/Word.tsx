import { useTransform, motion, MotionValue } from "framer-motion";

type WordProps = {
  scrollYProgress: MotionValue<number>;
  index: number;
  word: string;
  totalWords: number;
};

const Word = ({ scrollYProgress, index, word, totalWords }: WordProps) => {
  const wordFraction = 1 / totalWords;
  const start = index * wordFraction;
  const end = start + wordFraction;
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

  return (
    <motion.span
      className="transition-opacity duration-300"
      style={{ opacity }}
    >
      {word + " "}
    </motion.span>
  );
};

export default Word;
