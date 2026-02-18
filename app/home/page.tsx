import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { HomeContent } from "@/components/home-content";

export const metadata: Metadata = {
  title: "StreamVerse",
  description: "Descubre y ve miles de series y peliculas.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HomeContent />
    </main>
  );
}
