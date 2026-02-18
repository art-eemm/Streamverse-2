import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { HomeContent } from "@/components/home-content";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Movie } from "@/lib/mockData";

export const metadata: Metadata = {
  title: "StreamVerse",
  description: "Descubre y ve miles de series y peliculas.",
};

interface MovieDB {
  id: number;
  title: string;
  year: number;
  rating: number;
  description: string;
  short_description: string;
  image_url: string | null;
  trailer_url: string;
  duration: string;
  director: string;
  featured: boolean;
  status: number;
  images: {
    url: string;
    type: string;
  }[];
  movie_categories: {
    categories: {
      name: string;
    } | null;
  }[];
  movie_cast: {
    cast: {
      name: string;
    } | null;
  }[];
}

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

  const movies: Movie[] =
    moviesDB?.flatMap((m) => {
      const heroImgObj =
        m.images?.find((img) => img.type?.toLowerCase().trim() === "hero") ||
        m.images?.[0];

      const categoriesFound = m.movie_categories
        ?.map((mc) => mc.categories?.name)
        .filter(Boolean) as string[];
      const categoriesToMap =
        categoriesFound.length > 0 ? categoriesFound : ["General"];

      const castList =
        m.movie_cast
          ?.map((mc) => mc.cast?.name)
          .filter((name): name is string => !!name) || [];

      return categoriesToMap.map((categoryName) => ({
        id: m.id.toString(),
        title: m.title,
        year: Number(m.year),
        rating: m.rating,
        category: categoryName,
        description: m.description,
        shortDescription: m.short_description,
        image: m.image_url || "/placeholder.jpg",
        heroImage: heroImgObj?.url || m.image_url || undefined,
        trailerUrl: m.trailer_url,
        duration: m.duration,
        director: m.director,
        cast: castList,
        featured: m.featured,
      }));
    }) || [];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HomeContent initialMovies={movies} user={user} />
    </main>
  );
}
