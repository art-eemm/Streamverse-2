"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Movie } from "@/lib/mockData";

interface HeroCarouselProps {
  movies: Movie[];
}

export function HeroCarousel({ movies }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % movies.length);
  }, [movies.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + movies.length) % movies.length);
  }, [movies.length]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next, movies.length]);

  if (!movies || movies.length === 0) return null;

  const movie = movies[current];

  if (!isLoaded) {
    return (
      <div className="relative h-[75vh] md:h-[85vh] w-full bg-secondary animate-pulse" />
    );
  }

  return (
    <section
      className="relative h-[75vh] md:h-[85vh] w-full overflow-hidden"
      aria-label="Peliculas destacadas"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={movie.heroImage || movie.image}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/30 to-transparent" />

      <div className="absolute inset-0 flex items-end">
        <div className="w-full px-4 pb-20 md:pb-24 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-2xl"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-3 flex items-center gap-3"
                >
                  <span className="rounde-md bg-primary/20 px-3 py-1 text-xs font-medium text-primary font-sans">
                    {movie.category}
                  </span>
                  <span className="text-sm text-muted-foreground font-sans">
                    {movie.year}
                  </span>
                  <span className="text-sm text-muted-foreground font-sans">
                    {movie.duration}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-yellow-400 font-sans">
                    {"★"} {movie.rating}
                  </span>
                </motion.div>

                <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance font-sans">
                  {movie.title}
                </h1>

                <p className="mt-4 text-base text-foreground/80 leading-relaxed md:text-lg max-w-xl text-pretty font-sans">
                  {movie.shortDescription}
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <Link
                    href={`/movie/${movie.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 font-sans"
                  >
                    <Play className="h-4 w-4 fill-current" /> Ver Ahora
                  </Link>
                  <Link
                    href={`/movie/${movie.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-foreground/10 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-foreground/20 hover:scale-105 font-sans"
                  >
                    <Info className="h-4 w-4" />
                    Más Info
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-4 flex items-center gap-3 lg:right-16 z-100">
        <button
          onClick={prev}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 backdrop-blur-sm text-foreground transition-all hover:bg-foreground/20"
          aria-label="Ver anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {movies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === current ? "w-8 bg-primary" : "w-1.5 bg-foreground/30 hover:bg-foreground/50"}`}
              aria-label={`Ir a ${idx + 1}`}
            ></button>
          ))}
        </div>

        <button
          onClick={next}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 backdrop-blur-sm text-foreground transition-all hover:bg-foreground/20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
