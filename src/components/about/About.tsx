import { ArrowUpRight } from "lucide-react";

const About = () => (
  <section
    aria-labelledby="about-heading"
    className="relative z-10 flex min-h-dvh items-center bg-stone-50 px-6 pt-24 pb-16 font-sans text-stone-950 selection:bg-green-200 selection:text-green-950 md:px-10 md:py-28 lg:sticky lg:bottom-0"
  >
    <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-20">
      <div>
        <h2
          id="about-heading"
          className="font-sans text-6xl leading-none font-bold tracking-[-0.04em] sm:text-7xl xl:text-8xl"
        >
          About <span className="text-green-800">me.</span>
        </h2>
        <p className="mt-5 max-w-sm text-lg leading-relaxed text-stone-700">
          I’m Mohamed Reda, a freelance full-stack web developer. I work across
          the front end and back end, with a particular interest in how people
          navigate and interact with web applications.
        </p>
        <a
          href="#contact"
          className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-green-800 underline decoration-green-800/40 underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-800"
        >
          Get in touch
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </a>
      </div>

      <div className="border-y border-stone-300">
        <div className="grid gap-3 py-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-5">
          <h3 className="pt-1 font-sans text-xs font-bold tracking-widest text-green-800 uppercase">
            Education
          </h3>
          <div>
            <p className="text-xl font-semibold tracking-tight sm:text-2xl">
              Mansoura University
            </p>
            <p className="mt-1 leading-relaxed text-stone-700">
              B.Sc. in Computer Science, Faculty of Computer and Information
              Technology
            </p>
            <p className="mt-2 text-sm text-stone-600 tabular-nums">
              <time dateTime="2022">2022</time>-{" "}
              <time dateTime="2026">2026</time>
            </p>
          </div>
        </div>

        <div className="grid gap-3 border-t border-stone-300 py-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-5">
          <h3 className="pt-1 font-sans text-xs font-bold tracking-widest text-green-800 uppercase">
            Experience
          </h3>
          <ul className="space-y-5">
            <li>
              <p className="text-xl font-semibold tracking-tight sm:text-2xl">
                Frontend Developer Intern at Omnexa
              </p>
              <p className="mt-1 text-sm text-stone-600 tabular-nums">
                <time dateTime="2026-07">July</time> -{" "}
                <time dateTime="2026-10">October 2026</time>
              </p>
            </li>
            <li>
              <p className="text-xl font-semibold tracking-tight sm:text-2xl">
                Freelance Full-Stack Web Developer
              </p>
              <p className="mt-1 text-sm text-stone-600 tabular-nums">
                <time dateTime="2025-04">April 2025</time> - Present
              </p>
            </li>
          </ul>
        </div>

        <div className="grid gap-3 border-t border-stone-300 py-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-5">
          <h3 className="pt-1 font-sans text-xs font-bold tracking-widest text-green-800 uppercase">
            Focus
          </h3>
          <ul className="space-y-4">
            <li>
              <p className="text-lg font-medium tracking-tight sm:text-xl">
                Software Architecture
              </p>
              <p className="mt-1 leading-relaxed text-stone-700">
                How to structure web applications so they’re easier to test,
                maintain, and extend.
              </p>
            </li>
            <li>
              <p className="text-lg font-medium tracking-tight sm:text-xl">
                AI &amp; Process Automation
              </p>
              <p className="mt-1 leading-relaxed text-stone-700">
                Where AI and automation can reduce repetitive work in everyday
                workflows.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default About;
