import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import VideoSection from "@/components/VideoSection";
import Features from "@/components/Features";
import Reels from "@/components/Reels";
import RoleCarousel from "@/components/RoleCarousel";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Nav />
      <Hero />
      <CategoryGrid />
      <VideoSection />
      <Features />
      <Reels />
      <RoleCarousel />
      <Footer />
      <ChatWidget />
    </main>
  );
}
