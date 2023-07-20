const scrollToRef = (ref: React.RefObject<HTMLElement>) => {
  if (ref.current) {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }
};

export const handleScrollToSection =
  (ref: React.RefObject<HTMLElement>) =>
  (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    scrollToRef(ref);
  };
