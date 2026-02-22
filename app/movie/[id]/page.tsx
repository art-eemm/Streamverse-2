import { Navbar } from "@/components/navbar";
import { MovieDetail } from "@/components/movie-detail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Movie } from "@/lib/mockData";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: movie } = await supabase
    .from("movies")
    .select("title, short_description")
    .eq("id", id)
    .single();

  if (!movie) return { title: "Movie Not Found - StreamVerse" };

  return {
    title: `${movie.title} - StreamVerse`,
    description: movie.short_description,
  };
}

type DbImage = { url: string; type: string };
type DbCategory = { categories: { name: string } | null };
type DbCast = { cast: { name: string } | null };
type DbRelated = {
  id: string;
  title: string;
  image_url: string;
  year: number;
  rating: number;
};

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: movie, error } = await supabase
    .from("movies")
    .select(
      `
      *,
      movie_categories(categories(name)),
      movie_cast(cast(name)),
      images(url, type)
    `,
    )
    .eq("id", id)
    .single();

  if (error || !movie) {
    notFound();
  }

  const formattedMovie = {
    id: movie.id,
    title: movie.title,
    description: movie.description,
    image: movie.image_url,
    heroImages:
      movie.images
        ?.filter((img: DbImage) => img.type === "hero")
        .map((img: DbImage) => img.url) || [],
    trailerUrl: movie.trailer_url,
    year: movie.year,
    duration: movie.duration,
    director: movie.director,
    rating: movie.rating,
    categories:
      (movie.movie_categories
        ?.map((mc: DbCategory) => mc.categories?.name)
        .filter(Boolean) as string[]) || [],
    cast:
      (movie.movie_cast
        ?.map((mc: DbCast) => mc.cast?.name)
        .filter(Boolean) as string[]) || [],
  };

  // 3. Buscamos películas relacionadas (misma primera categoría, excluyendo la actual)
  let relatedMovies: Movie[] = [];

  if (formattedMovie.categories.length > 0) {
    const firstCat = formattedMovie.categories[0];
    const { data: relatedData } = await supabase
      .from("movies")
      .select(
        `id, title, image_url, year, rating, movie_categories!inner(categories!inner(name))`,
      )
      .eq("movie_categories.categories.name", firstCat)
      .neq("id", movie.id)
      .limit(4);

    if (relatedData) {
      relatedMovies = relatedData.map(
        (m: DbRelated) =>
          ({
            id: m.id,
            title: m.title,
            image: m.image_url,
            category: firstCat,
            year: m.year,
            rating: m.rating,
            duration: "",
            director: "",
            cast: [],
            description: "",
            shortDescription: "",
            trailerUrl: "",
            heroImage: "",
          }) as unknown as Movie,
      );
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <MovieDetail movie={formattedMovie} relatedMovies={relatedMovies} />
    </main>
  );
}
