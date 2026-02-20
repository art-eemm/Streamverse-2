"use client";

import { Film, Users, TrendingUp, Eye } from "lucide-react";
import { motion } from "framer-motion";
import type { Movie, User } from "@/lib/mockData"; // 1. Solo importamos tipos

// 2. Definimos que recibe las props
interface DashboardOverviewProps {
  movies: Movie[];
  users: User[];
}

export function DashboardOverview({ movies, users }: DashboardOverviewProps) {
  // 3. Calculamos las estadísticas con los datos reales
  const stats = [
    {
      label: "Total Películas",
      value: movies.length.toString(),
      icon: Film,
      change: "En catálogo activo",
    },
    {
      label: "Total Usuarios",
      value: users.length.toString(),
      icon: Users,
      change: "Usuarios registrados",
    },
    {
      label: "Calificación Prom.",
      // Evitamos dividir por cero si no hay películas
      value:
        movies.length > 0
          ? (
              movies.reduce((acc, m) => acc + m.rating, 0) / movies.length
            ).toFixed(1)
          : "0.0",
      icon: TrendingUp,
      change: "Promedio global",
    },
    {
      label: "Vistas Totales",
      value: "284K", // (Este lo dejamos fijo hasta que tengas una tabla de views)
      icon: Eye,
      change: "Dato simulado",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground font-sans">
                  {stat.label}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground font-sans">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground font-sans">
                {stat.change}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-base font-semibold text-foreground mb-4 font-sans">
            Películas Mejor Calificadas
          </h3>
          <div className="flex flex-col gap-3">
            {movies
              // Ordenamos de mayor a menor rating
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 5) // Tomamos solo el Top 5
              .map((movie, idx) => (
                <div
                  key={movie.id}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary font-sans">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate font-sans">
                      {movie.title}
                    </p>
                    <p className="text-xs text-muted-foreground font-sans">
                      {movie.category}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-yellow-400 font-sans">
                    {"★"} {movie.rating}
                  </span>
                </div>
              ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-base font-semibold text-foreground mb-4 font-sans">
            Usuarios Recientes
          </h3>
          <div className="flex flex-col gap-3">
            {users.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
              >
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-medium text-primary font-sans uppercase">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate font-sans">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-sans">
                    {user.email}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium font-sans ${
                    user.role === "admin"
                      ? "bg-purple-500/10 text-purple-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
