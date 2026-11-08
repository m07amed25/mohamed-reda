"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$?/\\";
const SCRAMBLE_MS = 700;
const TICK_MS = 45;

export interface NotFoundProps {
  className?: string;
  code?: string;
  title?: string;
  description?: string;
  homeHref?: string;
  homeLabel?: string;
  browseHref?: string;
  browseLabel?: string;
}

function Scramble({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reduce) return;

    const chars = Array.from(text);
    const start = performance.now();
    let last = start - TICK_MS;
    let frame: number;

    const loop = (now: number) => {
      const elapsed = now - start;
      if (elapsed >= SCRAMBLE_MS) {
        setDisplay(text);
        return;
      }

      if (now - last >= TICK_MS) {
        last = now;
        const settled = Math.floor((elapsed / SCRAMBLE_MS) * chars.length);
        setDisplay(
          chars
            .map((char, index) =>
              index < settled || char === " "
                ? char
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )
            .join(""),
        );
      }

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [text, reduce]);

  return (
    <div className="relative select-none font-mono leading-[0.85] font-bold tracking-[-0.08em] tabular-nums [font-size:clamp(4.5rem,21vw,14rem)]">
      <span className="relative">{reduce ? text : display}</span>
      <span className="pointer-events-none absolute inset-0 translate-x-1.5 text-background opacity-0 [clip-path:inset(31%_0_55%)] [-webkit-text-stroke:1px_currentColor] group-hover:opacity-100 motion-reduce:hidden">
        {display}
      </span>
      <span className="pointer-events-none absolute inset-0 -translate-x-1.5 opacity-0 [clip-path:inset(62%_0_24%)] group-hover:opacity-50 motion-reduce:hidden">
        {display}
      </span>
    </div>
  );
}

export function NotFoundGlitch({
  className,
  code = "404",
  title = "Page not found",
  description = "The page you are looking for does not exist or has been moved.",
  homeHref = "/",
  homeLabel = "Go home",
  browseHref,
  browseLabel = "Browse pages",
}: NotFoundProps) {
  return (
    <section
      className={cn(
        "flex min-h-[520px] w-full flex-col items-center justify-center gap-7 bg-background px-6 py-20 text-center text-foreground sm:gap-9",
        className,
      )}
    >
      <span className="sr-only">Error {code}</span>
      <div
        aria-hidden="true"
        className="group grid w-full max-w-3xl place-items-center py-10 sm:py-12"
      >
        <Scramble key={code} text={code} />
      </div>

      <div className="flex flex-col items-center gap-3">
        <h1 className="text-balance font-sans text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
          {title}
        </h1>
        <p className="max-w-[42ch] text-pretty text-sm leading-relaxed text-foreground/65 sm:text-base">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href={homeHref}
          className="group/action inline-flex min-h-12 items-center justify-center gap-6 border border-foreground bg-foreground px-5 text-sm font-semibold text-background hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 motion-safe:transition-colors"
        >
          {homeLabel}
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 motion-safe:transition-transform motion-safe:group-hover/action:translate-x-0.5 motion-safe:group-hover/action:-translate-y-0.5"
          />
        </a>
        {browseHref && (
          <a
            href={browseHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 motion-safe:transition motion-safe:active:scale-[0.97]"
          >
            {browseLabel}
          </a>
        )}
      </div>
    </section>
  );
}
