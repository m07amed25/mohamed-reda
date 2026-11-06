import { useId } from "react";
import { ArrowUpRight } from "lucide-react";
import { contactHref } from "./contact";

export const SpinningCTA = () => {
  const ringId = useId();

  return (
    <a
      href={contactHref}
      aria-label="Get in touch by email"
      className="group relative mt-6 isolate grid size-28 shrink-0 place-items-center rounded-full border border-white/40 text-white outline-offset-4 hover:border-white/70 focus-visible:border-white/70 focus-visible:outline-2 focus-visible:outline-white motion-safe:transition-[scale,border-color] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:hover:scale-105 motion-safe:active:scale-95 md:mt-8 md:size-32"
    >
      <svg
        viewBox="0 0 112 112"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full text-green-400 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:-rotate-90 motion-safe:transition-[rotate,opacity] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:rotate-45 motion-safe:group-focus-visible:rotate-45"
      >
        <path
          d="M56 2a54 54 0 0 1 27 7.2"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <circle cx="83" cy="9.2" r="2" fill="currentColor" />
      </svg>
      <svg
        viewBox="0 0 112 112"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full fill-current motion-safe:animate-spin motion-safe:[animation-duration:18s] group-hover:[animation-play-state:paused] group-focus-visible:[animation-play-state:paused]"
      >
        <defs>
          <path id={ringId} d="M56 13a43 43 0 1 1 0 86a43 43 0 1 1 0-86" />
        </defs>
        <text className="font-sans text-[10px] font-bold">
          <textPath
            href={`#${ringId}`}
            startOffset="50%"
            textAnchor="middle"
            textLength="252"
          >
            GET IN TOUCH • GET IN TOUCH •
          </textPath>
        </text>
      </svg>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute size-[76%] scale-0 rounded-full bg-white group-hover:scale-100 group-focus-visible:scale-100 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-in motion-safe:group-hover:duration-500 motion-safe:group-hover:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-focus-visible:duration-500 motion-safe:group-focus-visible:ease-[cubic-bezier(0.22,1,0.36,1)]"
      />
      <ArrowUpRight
        aria-hidden="true"
        className="relative size-5 mix-blend-difference motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-focus-visible:translate-x-0.5 motion-safe:group-focus-visible:-translate-y-0.5"
      />
    </a>
  );
};

export const MobileContactCTA = () => (
  <a
    href="#contact"
    className="group relative overflow-hidden border border-white/30 px-5 py-3 flex items-center gap-3 hover:border-white transition-colors duration-500 w-fit mb-6 md:hidden"
  >
    <span className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
    <span className="relative font-sans font-black text-[10px] tracking-[0.25] uppercase text-white group-hover:text-black transition-colors duration-300 z-10">
      Get in touch
    </span>
    <svg
      className="relative w-3 h-3 text-white group-hover:text-black transition-colors duration-300 z-10"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M1 6h10M6 1l5 5-5 5" />
    </svg>
  </a>
);
