"use-client";

import { Suspense } from "react";
import { HeroCarousel } from "./hero-carousel";
import { MovieRow } from "./movie-row";
import { HeroSkeleton, MovieRowSkeleton } from "./skeleton-loader";
import type { Movie } from "@/lib/mockData";
import type { User } from "@supabase/supabase-js";

interface HomeContentProps {
  initialMovies: Movie[];
  user: User;
}

export function HomeContent({ initialMovies, user }: HomeContentProps) {
  const featuredMovies = initialMovies.filter((movie) => movie.featured);
  const categories = Array.from(new Set(initialMovies.map((m) => m.category)));
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroCarousel movies={featuredMovies} />
      </Suspense>

      <div id="categories" className="relative z-10 -mt-16 pb-12">
        {categories.map((category) => {
          const categoryMovies = initialMovies.filter(
            (m) => m.category === category,
          );
          if (categoryMovies.length === 0) return null;
          return (
            <Suspense key={category} fallback={<MovieRowSkeleton />}>
              <MovieRow title={category} movies={categoryMovies} />
            </Suspense>
          );
        })}
      </div>
    </>
  );
}
