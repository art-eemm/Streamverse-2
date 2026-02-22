"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Film,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { TrailerModal } from "./trailer-modal";
import type { Movie } from "@/lib/mockData";
import { getMoviesByCategory, type Category } from "@/lib/mockData";
import { MovieCard } from "./movie-card";

interface MovieDetailProps {
  movie: Movie;
}

export function MovieDetail({ movie }: MovieDetailProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [dominantColor, setDominantColor] = useState("oklch(0.25 0.05 250)");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const extractColor = useCallback(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = movie.heroImage || movie.image;

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);

      const imageData = ctx.getImageData(0, 0, 50, 50).data;
      let r = 0,
        g = 0,
        b = 0,
        count = 0;

      for (let i = 0; i < imageData.length; i += 16) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
        count++;
      }

      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      setDominantColor(`rgb(${r}, ${g}, ${b})`);
    };
  }, [movie.heroImage, movie.image]);

  useEffect(() => {
    extractColor();
  }, [extractColor]);

  const relatedMovies = getMoviesByCategory(movie.category as Category).filter(
    (m) => m.id !== movie.id,
  );

  return (
    <>
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Dynamic Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse at top left, ${dominantColor}40 0%, transparent 50%),
                       radial-gradient(ellipse at bottom right, ${dominantColor}20 0%, transparent 50%),
                       var(--background)`,
        }}
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
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

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 to-transparent" />

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-20 left-4 lg:left-8"
          >
            <Link
              href="/home"
              className="inline-flex items-center gap-2 rounded-full bg-foreground/10 px-4 py-2 text-sm text-foreground backdrop-blur-sm transition-all hover:bg-foreground/20 font-sans"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </motion.div>
        </section>

        {/* Content */}
        <section className="relative -mt-40 px-4 pb-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-shrink-0"
              >
                <div className="relative mx-auto w-48 md:w-64 aspect-[2/3] overflow-hidden rounded-xl shadow-2xl lg:mx-0">
                  <Image
                    src={movie.image}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 192px, 256px"
                    priority
                  />
                </div>
              </motion.div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex-1"
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="rounded-md bg-primary/20 px-3 py-1 text-xs font-medium text-primary font-sans">
                    {movie.category}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-semibold font-sans">
                      {movie.rating}
                    </span>
                  </div>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance font-sans">
                  {movie.title}
                </h1>

                {/* Meta */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-sans">
                    <Calendar className="h-4 w-4" />
                    {movie.year}
                  </span>
                  <span className="flex items-center gap-1.5 font-sans">
                    <Clock className="h-4 w-4" />
                    {movie.duration}
                  </span>
                  <span className="flex items-center gap-1.5 font-sans">
                    <Film className="h-4 w-4" />
                    {movie.director}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-6 text-base text-foreground/80 leading-relaxed max-w-2xl text-pretty font-sans">
                  {movie.description}
                </p>

                {/* Cast */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground font-sans">
                      Cast
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {movie.cast.map((actor) => (
                      <span
                        key={actor}
                        className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground font-sans"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex items-center gap-4">
                  <button
                    onClick={() => setIsTrailerOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 font-sans"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Watch Trailer
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-lg bg-foreground/10 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-foreground/20 hover:scale-105 font-sans">
                    + My List
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-16"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4 font-sans">
                Gallery
              </h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  movie.heroImage || movie.image,
                  movie.image,
                  movie.heroImage || movie.image,
                  movie.image,
                ].map((src, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video overflow-hidden rounded-lg bg-secondary"
                  >
                    <Image
                      src={src}
                      alt={`${movie.title} scene ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Related */}
            {relatedMovies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-16"
              >
                <h2 className="text-xl font-semibold text-foreground mb-4 font-sans">
                  More in {movie.category}
                </h2>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4">
                  {relatedMovies.map((m, i) => (
                    <MovieCard key={m.id} movie={m} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerUrl={movie.trailerUrl}
        title={movie.title}
      />
    </>
  );
}
