"use client";

import { useRef, useState, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { MovieCard } from "./movie-card";
import type { Movie } from "@/lib/mockData";

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export const MovieRow = memo(function MovieRow({
  title,
  movies,
}: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 400);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="relative py-4 md:py-6"
    >
      <h2 className="mb-3 px-4 text-lg font-semibold text-foreground md:text-xl lg:px-8 font-sans">
        {title}
      </h2>

      <div className="group/row relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 z-10 hidden h-full w-12 items-center justify-center bg-linear-to-r from-background/90 to-transparent transition-opacity md:flex"
            aria-label={`Scroll ${title} izquierda`}
          >
            <ChevronLeft className="h-8 w-8 text-foreground" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto px-4 lg:px-8 no-scrollbar"
        >
          {movies.map((movie, i) => (
            <MovieCard key={movie.id} movie={movie} index={i} />
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 z-10 hidden h-full w-12 items-center justify-center bg-gradient-to-l from-background/90 to-transparent transition-opacity md:flex"
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="h-8 w-8 text-foreground" />
          </button>
        )}
      </div>
    </motion.section>
  );
});
