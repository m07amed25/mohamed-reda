import { CloudUpload, Cpu, Workflow } from "lucide-react";
import {
  SiBetterauth,
  SiFirebase,
  SiGooglemaps,
  SiNextdotjs,
  SiNgrok,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPusher,
  SiReact,
  SiRedux,
  SiSpringboot,
  SiTailwindcss,
  SiTrpc,
  SiTypescript,
} from "react-icons/si";
import firestoreLogo from "@/assets/firestore.svg";
import { ProjectShowcase } from "@/components/ui/project-showcase";

const tech = {
  react: { name: "React", logo: <SiReact /> },
  node: { name: "Node.js", logo: <SiNodedotjs /> },
  firebase: { name: "Firebase", logo: <SiFirebase /> },
  firestore: { name: "Firestore", logo: <img src={firestoreLogo} alt="" /> },
  redux: { name: "Redux", logo: <SiRedux /> },
  maps: { name: "Google Maps API", logo: <SiGooglemaps /> },
  spring: { name: "Spring Boot", logo: <SiSpringboot /> },
  ngrok: { name: "ngrok", logo: <SiNgrok /> },
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
    id: "001",
    shortTitle: "ERP Platform",
    title: "Enterprise Resource Architecture",
    stack: [tech.react, tech.node, tech.firebase, tech.firestore],
    description:
      "A full-stack ERP engine automating multi-currency invoicing, inventory logic, and international tax compliance for distributed teams.",
    links: [{ href: "https://erpbeta.netlify.app", label: "Live Project" }],
    image: "/p1.png",
  },
  {
    id: "002",
    shortTitle: "Workforce Analytics",
    title: "Geospatial Workforce Analytics",
    stack: [tech.react, tech.redux, tech.maps, tech.firebase],
    description:
      "Real-time tracking system implementing location-based validation protocols and live route visualization for workforce monitoring.",
    image: "/p2.png",
  },
  {
    id: "003",
    shortTitle: "OrderEase",
    title: "OrderEase: Real-time online table food ordering system",
    stack: [tech.react, tech.firebase, tech.node],
    description:
      "A real-time restaurant table ordering system that allows customers to place food orders directly from their table while enabling admins to manage menus, waiters, and assign waiters to customers for seamless service coordination.",
    links: [{ href: "https://github.com/MAHESHPPAI/OrderEase", label: "View on GitHub" }],
    image: "/p3.png",
  },
  {
    id: "004",
    shortTitle: "BusBuddy",
    title: "BusBuddy: Transit Management Logic",
    stack: [tech.react, tech.firebase, tech.spring, tech.ngrok],
    description:
      "A real-time campus transportation platform that enables students to book seats and track buses live, drivers to stream GPS data during journeys, and transport officers to manage fleet availability, monitoring, and notifications seamlessly.",
    links: [{ href: "https://github.com/MAHESHPPAI/Busbuddy-latest", label: "View on GitHub" }],
    image: "/p4.png",
  },
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
      { href: "https://codecatch.dev/", label: "Try Code Catch" },
      { href: "https://github.com/m07amed25/DevReview-AI", label: "View on GitHub" },
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
      { href: "https://rawad-mu.vercel.app", label: "Try Rawad" },
      { href: "https://github.com/m07amed25/rawad", label: "View on GitHub" },
    ],
    image: "/p6.png",
  },
];

const SelectedWork = () => <ProjectShowcase projects={projects} />;

export default SelectedWork;
