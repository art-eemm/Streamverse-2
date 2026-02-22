import { movies, getMovieById } from "@/lib/mockData";
import { Navbar } from "@/components/navbar";
import { MovieDetail } from "@/components/movie-detail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return movies.map((movie) => ({ id: movie.id }));
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = getMovieById(id);
  if (!movie) return { title: "Movie Not Found - StreamVerse" };
  return {
    title: `${movie.title} - StreamVerse`,
    description: movie.shortDescription,
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movie = getMovieById(id);

  if (!movie) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <MovieDetail movie={movie} />
    </main>
  );
}
