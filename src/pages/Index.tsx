import About from "@/components/about/About";
import { BrandLogo } from "@/components/hero/brand-logo";
import { CursorFollower } from "@/components/hero/cursor-follower";
import { Hero } from "@/components/hero/hero";
import Navbar from "@/components/Navbar";
import SelectedWork from "@/components/SelectedWork";
import { Bookademo3 } from "@/components/ui/book-a-demo-3";

export { Mail } from "lucide-react";
export {
  FaGithub as Github,
  FaInstagram as Instagram,
  FaLinkedin as Linkedin,
} from "react-icons/fa6";

const Index = () => (
  <div className="min-h-screen relative bg-black selection:bg-white selection:text-black">
    <Navbar />
    <BrandLogo />
    <CursorFollower />
    <Hero />
    <div id="about" />
    <About />

    <div className="relative z-20">
      <SelectedWork />
    </div>
    <div id="contact" />
    <Bookademo3 />
  </div>
);

export default Index;
