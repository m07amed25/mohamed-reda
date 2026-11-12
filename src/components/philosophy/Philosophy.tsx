import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { ArrowUpRight, GitPullRequest, ScanEye, Workflow } from "lucide-react";
import { projectLinks } from "@/lib/project-links";
import "./philosophy.css";

const principles = [
  {
    title: "Put feedback where people already work.",
    example: "Code Catch brings review findings into the pull request, where developers can discuss and act on them.",
    project: "Code Catch",
    href: projectLinks.codeCatch.live,
    icon: GitPullRequest,
  },
  {
    title: "Build accessibility into the task.",
    example: "Rawad lets teachers attach sign-language videos to individual exam questions so students can access them as they go.",
    project: "Rawad",
    href: projectLinks.rawad.live,
    icon: ScanEye,
  },
  {
    title: "Automate the repeatable parts.",
    example: "Rawad grades multiple-choice answers automatically and leaves essay scoring to teachers.",
    project: "Rawad",
    href: projectLinks.rawad.live,
    icon: Workflow,
  },
];

const orbitAngles = Array.from({ length: 18 }, (_, index) => index * 10);

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    // The lazy-loaded home page can mount after the browser resolves the fragment.
    if (window.location.hash === "#philosophy") {
      sectionRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      aria-labelledby="philosophy-heading"
      className="philosophy"
      tabIndex={-1}
    >
      <div className="philosophy-inner">
        <header className="philosophy-intro">
          <div>
            <h2 id="philosophy-heading" className="philosophy-heading">
              <span>Build around</span>{" "}
              <span>the people</span>{" "}
              <span>doing the work.</span>
            </h2>
            <p className="philosophy-lead">
              I start by looking at what people are trying to do and where they
              get stuck. That tells me what the interface should make clearer,
              what the software can handle, and where people need to stay in control.
            </p>
          </div>
          <div className="philosophy-art" aria-hidden="true">
            <div className="philosophy-orbit">
              {orbitAngles.map((angle) => (
                <span key={angle} style={{ "--orbit-angle": `${angle}deg` } as CSSProperties} />
              ))}
              <div className="philosophy-satellite" />
            </div>
            <span className="philosophy-core" />
          </div>
        </header>

        <ul className="philosophy-principles" role="list">
          {principles.map(({ title, example, project, href, icon: Icon }) => (
            <li className="philosophy-principle" key={title}>
              <Icon className="philosophy-icon" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{example}</p>
              <a className="philosophy-link" href={href} target="_blank" rel="noopener noreferrer">
                See {project}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
