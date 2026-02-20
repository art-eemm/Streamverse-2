import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { HomeContent } from "@/components/home-content";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { type MovieDB } from "@/lib/mockData";
import { formatMoviesFromDB } from "@/lib/utils";

export const metadata: Metadata = {
  title: "StreamVerse",
  description: "Descubre y ve miles de series y peliculas.",
};

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: moviesDB, error } = await supabase
    .from("movies")
    .select(
      `*,images(url, type),movie_categories(categories(name)),movie_cast(cast(name))`,
    )
    .eq("status", 1)
    .returns<MovieDB[]>();

  if (error) console.error("Error al obtener las peliculas:", error);

  const movies = formatMoviesFromDB(moviesDB);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HomeContent initialMovies={movies} user={user} />
    </main>
  );
}
