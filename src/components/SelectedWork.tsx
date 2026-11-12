import { CloudUpload, Cpu, Workflow } from "lucide-react";
import {
  SiBetterauth,
  SiNextdotjs,
  SiPostgresql,
  SiPrisma,
  SiPusher,
  SiTailwindcss,
  SiTrpc,
  SiTypescript,
} from "react-icons/si";
import { ProjectShowcase } from "@/components/ui/project-showcase";
import { projectLinks } from "@/lib/project-links";

const tech = {
  nextjs: { name: "Next.js", logo: <SiNextdotjs /> },
  typescript: { name: "TypeScript", logo: <SiTypescript /> },
  postgresql: { name: "PostgreSQL", logo: <SiPostgresql /> },
  prisma: { name: "Prisma", logo: <SiPrisma /> },
  trpc: { name: "tRPC", logo: <SiTrpc /> },
  groq: { name: "Groq", logo: <Cpu /> },
  inngest: { name: "Inngest", logo: <Workflow /> },
  pusher: { name: "Pusher", logo: <SiPusher /> },
  tailwindcss: { name: "Tailwind CSS", logo: <SiTailwindcss /> },
  betterAuth: { name: "Better Auth", logo: <SiBetterauth /> },
  uploadthing: { name: "UploadThing", logo: <CloudUpload /> },
};

const projects = [
  {
    id: "005",
    shortTitle: "Code Catch",
    title: "Code Catch: AI-Powered Code Review & GitHub Automation",
    wideDetails: true,
    stack: [
      tech.nextjs,
      tech.typescript,
      tech.postgresql,
      tech.prisma,
      tech.trpc,
      tech.groq,
      tech.inngest,
      tech.pusher,
    ],
    description:
      "An AI-powered code review platform that helps engineering teams catch bugs and security issues before merging. When a pull request is opened or updated in a connected GitHub repository, Code Catch can queue a background review, analyze the changed code with Groq, and post severity-ranked findings and suggested fixes directly on the pull request. The platform also scans for exposed credentials, vulnerable dependencies, and common security issues. Teams can discuss findings in real time, track recurring issues and code quality trends across repositories, and generate interactive entity–relationship diagrams from database schemas.",
    links: [
      { href: projectLinks.codeCatch.live, label: "Try Code Catch" },
      { href: projectLinks.codeCatch.source, label: "View on GitHub" },
    ],
    image: "/p5.png",
  },
  {
    id: "006",
    shortTitle: "Rawad",
    title: "Rawad (رواد): Accessible Online Exams & Live Proctoring",
    wideDetails: true,
    stack: [
      tech.nextjs,
      tech.typescript,
      tech.postgresql,
      tech.prisma,
      tech.tailwindcss,
      tech.betterAuth,
      tech.uploadthing,
    ],
    description:
      "An Arabic-language exam platform built to make online assessments more accessible to students with disabilities. Teachers can schedule timed exams with multiple-choice and essay questions, attach sign-language videos to individual questions, and monitor active attempts from a live dashboard. During an exam, teachers can send announcements and review flagged activity. Rawad grades multiple-choice answers automatically, lets teachers score essays manually, and gives students a dashboard to view their results.",
    links: [
      { href: projectLinks.rawad.live, label: "Try Rawad" },
      { href: projectLinks.rawad.source, label: "View on GitHub" },
    ],
    image: "/p6.png",
  },
];

const SelectedWork = () => <ProjectShowcase projects={projects} />;

export default SelectedWork;
