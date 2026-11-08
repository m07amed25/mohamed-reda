import { HighlightText } from "@animate-ui/react/primitives/texts/highlight";
import { MorphingText } from "@animate-ui/react/primitives/texts/morphing";

const heroWords = [
  "logic",
  "craft",
  "focus",
  "ideas",
  "care",
  "rigor",
  "vision",
];

export const HeroHeading = () => (
  <h1 className="font-sans font-bold text-[clamp(1.75rem,11vw,4.5rem)] md:text-8xl lg:text-[min(10.5vw,11rem)] leading-[0.85] tracking-tighter text-white uppercase text-left">
    <HighlightText
      text="Driven"
      className="mb-[0.05em] rounded-[0.12em] bg-linear-to-r from-green-800 to-green-700 px-[0.12em] py-[0.08em]"
      delay={150}
      transition={{ duration: 0.75, ease: "easeOut" }}
      inView
    />
    <br />
    <span className="whitespace-nowrap">
      by{" "}
      <MorphingText
        className="text-green-200"
        text={heroWords}
        holdDelay={1500}
        inView
        loop
      />
      <span className="sr-only">...</span>
      <span
        aria-hidden="true"
        className="hero-ellipsis ml-[0.07em] inline-flex gap-[0.035em] align-baseline text-green-200"
      >
        <span className="size-[0.12em] rounded-full bg-current" />
        <span className="size-[0.12em] rounded-full bg-current opacity-70" />
        <span className="size-[0.12em] rounded-full bg-current opacity-45" />
      </span>
    </span>
  </h1>
);
