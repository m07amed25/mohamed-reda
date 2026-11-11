import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowDown, ArrowUpRight, ImageOff } from "lucide-react";
import { useLenis } from "lenis/react";
import { scroll } from "motion";
import { BackgroundBeams } from "@/components/ui/background-beams";
import "./project-showcase.css";

interface Project {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  stack: readonly { name: string; logo: ReactNode }[];
  image: string;
  wideDetails?: boolean;
  links?: readonly { href: string; label: string }[];
}

const theaterMedia = "(min-width: 64rem) and (min-height: 42rem) and (prefers-reduced-motion: no-preference)";
const numberLabel = (index: number) => String(index + 1).padStart(2, "0");

function ProjectPreview({
  src,
  title,
  inTheater = false,
}: {
  src: string;
  title: string;
  inTheater?: boolean;
}) {
  const [unavailable, setUnavailable] = useState(false);

  return (
    <figure className={`${inTheater ? "work-scene-preview " : ""}min-w-0 self-center overflow-hidden rounded-lg border border-white/10 bg-[#090c0a] p-2 sm:p-3`}>
      <div className="relative grid aspect-[2.2] w-full place-items-center rounded-sm bg-black">
        {src && !unavailable ? (
          <img
            src={src}
            alt={`${title} interface`}
            loading={inTheater ? "eager" : "lazy"}
            decoding="async"
            onError={() => setUnavailable(true)}
            className="absolute inset-0 size-full rounded-sm object-contain"
          />
        ) : (
          <p className="flex flex-wrap items-center justify-center gap-2 p-2 text-center text-sm text-neutral-300">
            <ImageOff aria-hidden="true" className="size-4 shrink-0" />
            Preview unavailable
          </p>
        )}
      </div>
    </figure>
  );
}

function ProjectTools({ stack }: { stack: Project["stack"] }) {
  return (
    <ul role="list" aria-label="Tech stack" className="work-tools flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#bfcfc4]">
      {stack.map(({ name, logo }) => (
        <li key={name} className="inline-flex max-w-full items-center gap-1.5">
          <span aria-hidden="true" className="inline-flex size-4 shrink-0 items-center justify-center text-neutral-200 [&>img]:size-full [&>svg]:size-full">
            {logo}
          </span>
          <span dir="auto" className="min-w-0 wrap-anywhere">{name}</span>
        </li>
      ))}
    </ul>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  if (!project.links?.length) return null;

  return (
    <div className="flex flex-wrap gap-x-5">
      {project.links.map(({ href, label }) => (
        <a
          key={href}
          href={href}
          aria-label={`${label}: ${project.title}`}
          className="work-project-link inline-flex min-h-11 max-w-full items-center gap-2 rounded-sm font-semibold text-green-200 underline decoration-green-200/40 underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-200"
        >
          <span dir="auto" className="min-w-0 wrap-anywhere">{label}</span>
          <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
        </a>
      ))}
    </div>
  );
}

function WorkHeading({ count, theater = false }: { count: number; theater?: boolean }) {
  return (
    <header className={theater ? "work-theater-heading" : "mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-5"}>
      <h2 id="work-heading" className={theater ? "font-sans text-3xl font-bold tracking-tight lg:text-4xl" : "font-sans text-[clamp(3rem,6vw,6rem)] leading-none font-bold tracking-[-0.04em]"}>
        Selected <span className="text-green-200">Work</span>
      </h2>
      {theater ? (
        <span aria-hidden="true" className="inline-flex items-center gap-2 text-sm text-green-200">
          Scroll to explore <ArrowDown className="size-4" />
        </span>
      ) : (
        <span className="text-sm text-neutral-300">{count} {count === 1 ? "project" : "projects"}</span>
      )}
    </header>
  );
}

function ProjectTheater({ projects }: { projects: readonly Project[] }) {
  const reelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const [{ active, previous }, setScene] = useState({ active: 0, previous: -1 });
  const lenis = useLenis();

  useEffect(() => {
    const reel = reelRef.current;
    if (!reel) return;

    return scroll((progress) => {
      const next = Math.min(projects.length - 1, Math.floor(progress * projects.length));
      if (next === activeRef.current) return;

      // Keep keyboard focus visible if scrolling removes the currently focused scene.
      if (reel.querySelector(".work-scene[data-active]")?.contains(document.activeElement)) {
        navRef.current?.querySelectorAll("button")[next]?.focus({ preventScroll: true });
      }

      setScene({ active: next, previous: activeRef.current });
      activeRef.current = next;
    }, { target: reel, offset: ["start start", "end end"] });
  }, [projects.length]);

  const jumpTo = (index: number) => {
    const reel = reelRef.current;
    const screen = reel?.firstElementChild;
    if (!reel || !screen) return;

    const travel = reel.offsetHeight - screen.clientHeight;
    const position = index === 0 ? 0 : (index + 0.2) / projects.length;
    const top = window.scrollY + reel.getBoundingClientRect().top + travel * position;
    if (lenis) lenis.scrollTo(top, { duration: 0.8 });
    else window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div ref={reelRef} className="work-reel" style={{ "--work-project-count": projects.length } as CSSProperties}>
      <div className="work-screen" data-direction={active < previous ? "backward" : "forward"}>
        <WorkHeading count={projects.length} theater />
        <nav ref={navRef} aria-label="Selected projects" className="work-theater-nav">
          <ol role="list">
            {projects.map((project, index) => (
              <li key={project.id}>
                <button type="button" aria-current={index === active ? "true" : undefined} onClick={() => jumpTo(index)}>
                  <span className="text-xs font-medium tabular-nums">{numberLabel(index)}</span>
                  <span>{project.shortTitle}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <ol role="list" className="work-theater-scenes">
          {projects.map((project, index) => (
            <li
              key={project.id}
              className="work-scene"
              data-active={index === active ? "" : undefined}
              data-leaving={index === previous ? "" : undefined}
              inert={index !== active}
              aria-hidden={index !== active ? true : undefined}
            >
              <article className="work-scene-content" data-wide-details={project.wideDetails || undefined}>
                <ProjectPreview key={project.image} src={project.image} title={project.title} inTheater />
                <div className="work-scene-copy" role="group" aria-label="Project details" tabIndex={0} data-lenis-prevent>
                  <h3 dir="auto" aria-label={project.title} className="work-scene-title font-sans">
                    {project.title.split(/\s+/).map((word, wordIndex) => (
                      <Fragment key={wordIndex}>
                        {wordIndex > 0 && " "}
                        <span className="work-word-mask" aria-hidden="true">
                          <span style={{ "--work-word-index": wordIndex } as CSSProperties}>{word}</span>
                        </span>
                      </Fragment>
                    ))}
                  </h3>
                  <div className="work-scene-details">
                    <p dir="auto" className="wrap-anywhere text-[#e2ebe5]">{project.description}</p>
                    <div className="work-scene-tools">
                      <p aria-hidden="true" className="mb-2 text-xs font-semibold text-green-200">Built with</p>
                      <ProjectTools stack={project.stack} />
                    </div>
                    <ProjectLinks project={project} />
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>

        <div className="work-theater-progress" aria-hidden="true">
          <div className="mb-2 flex justify-between text-xs font-medium tabular-nums">
            <span className="text-green-200">{numberLabel(active)}</span>
            <span>{numberLabel(projects.length - 1)}</span>
          </div>
          <div className="h-px bg-white/30">
            <div
              className="work-theater-fill h-full bg-green-200"
              style={{ transform: `scaleX(${(active + 1) / projects.length})` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectShowcase({ projects }: { projects: readonly Project[] }) {
  const [theater, setTheater] = useState(() => typeof window !== "undefined" && matchMedia(theaterMedia).matches);

  useEffect(() => {
    const media = matchMedia(theaterMedia);
    const sync = () => setTheater(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <section id="work" aria-labelledby="work-heading" className="relative isolate bg-black font-sans text-white">
      {theater && projects.length > 1 ? (
        <ProjectTheater projects={projects} />
      ) : (
        <div className="relative isolate px-[clamp(1rem,5vw,6rem)] py-24 md:pt-28 md:pb-16">
          <BackgroundBeams className="pointer-events-none -z-10 max-h-svh overflow-hidden opacity-40" />
          <div className="mx-auto max-w-[80rem]">
            <WorkHeading count={projects.length} />
            {projects.length === 0 ? (
              <p className="py-6 text-neutral-300">No projects to show right now.</p>
            ) : (
              <ol role="list" className="space-y-6">
                {projects.map((project) => (
                  <li key={project.id}>
                    <article className="overflow-hidden rounded-2xl border border-[#343e37] bg-[#111613]">
                      <header className="flex items-baseline gap-3 border-b border-black/20 bg-green-200 px-4 py-2.5 text-black sm:gap-5 sm:px-6">
                        <span className="shrink-0 border-e border-black/25 pe-3 text-sm font-semibold tracking-wider tabular-nums sm:pe-5">{project.id}</span>
                        <h3 dir="auto" className="min-w-0 font-sans text-xl leading-tight font-bold tracking-tight wrap-anywhere lg:text-2xl">
                          {project.title}
                        </h3>
                      </header>
                      <div className="work-card-body grid gap-5 p-4 sm:p-6">
                        <ProjectPreview key={project.image} src={project.image} title={project.title} />
                        <div className="min-w-0 self-center">
                          <p dir="auto" className="max-w-prose text-base leading-relaxed wrap-anywhere text-[#e2ebe5]">{project.description}</p>
                          <div className="mt-4 border-t border-white/15 pt-4">
                            <ProjectTools stack={project.stack} />
                          </div>
                          <div className="mt-2">
                            <ProjectLinks project={project} />
                          </div>
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
