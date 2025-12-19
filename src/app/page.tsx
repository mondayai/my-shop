import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import VideoSection from "@/components/VideoSection";
import Features from "@/components/Features";
import Reels from "@/components/Reels";
import RoleCarousel from "@/components/RoleCarousel";
import Footer from "@/components/Footer";
import Test from "@/components/Test";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Nav />
      <Hero />
      <Test />
      <VideoSection />
      <Features />
      <Reels />
      <RoleCarousel />
      <Footer />
    </main>
  );
}
