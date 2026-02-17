"use-client";

import { Suspense } from "react";
import { HeroCarousel } from "./hero-carousel";
import { categories, getMoviesByCategory } from "@/lib/mockData";

export function HomeContent() {
  return (
    <>
      <Suspense>
        <HeroCarousel />
      </Suspense>

      <div id="categories" className="relative z-10 -mt-16 pb-12">
        {categories.map((category) => {
          const categoryMovies = getMoviesByCategory(category);
          if (categoryMovies.length === 0) return null;
          return <Suspense key={category}></Suspense>;
        })}
      </div>
    </>
  );
}
