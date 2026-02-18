"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Movie } from "@/lib/mockData";

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export const MovieCard = memo(function MovieCard({
  movie,
  index,
}: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group shrink-0 w-[150px] md:w-[200px]"
    >
      <Link href={`/movie/${movie.id}`} className="block">
        <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-secondary">
          <Image
            src={movie.image}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 150px, 200px"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-yellow-400 font-medium font-sans">
                {movie.rating}
              </span>
              <span className="text-xs text-foreground/60 font-sans">
                {movie.year}
              </span>
            </div>
            <p className="text-xs text-foreground/80 line-clamp-2 leading-relaxed font-sans">
              {movie.shortDescription}
            </p>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110">
              <Play className="h-5 w-5 fill-current ml-0.5" />
            </div>
          </div>

          <div className="mt-2 px-0.5">
            <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors font-sans">
              {movie.title}
            </h3>
            <p className="text-xs text-muted-foreground font-sans">
              {movie.category}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});
