"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Edit2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ITEMS_PER_PAGE = 8;

// Actualizamos la interfaz para que acepte el status real de Supabase
export interface AdminMovie {
  id: string;
  title: string;
  category: string | string[]; // Soportamos ambos por si viene como arreglo
  year: number;
  rating: number;
  duration: string;
  director: string;
  status: number; // 1 = Activo, 0 = Inactivo
}

interface MoviesTableProps {
  movies: AdminMovie[];
}

export function MoviesTable({ movies }: MoviesTableProps) {
  const router = useRouter();
  const supabase = createClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = movies.filter((m) => {
    const catStr = Array.isArray(m.category)
      ? m.category.join(" ")
      : String(m.category || "");
    return (
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      catStr.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleToggleStatus = async (id: string, currentStatus: number) => {
    setUpdatingId(id);
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;

      const { error } = await supabase
        .from("movies")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Ocurrió un error al intentar cambiar el estado de la película.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar películas..."
            className="w-full rounded-lg border border-border bg-input px-4 py-2 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
          />
        </div>
        <p className="text-sm text-muted-foreground font-sans">
          {filtered.length} películas
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider font-sans">
                  Título
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider font-sans">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider font-sans">
                  Año
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider font-sans">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider font-sans">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((movie) => {
                const isActive = movie.status === 1;

                return (
                  <tr
                    key={movie.id}
                    className={`border-b border-border last:border-0 transition-colors hover:bg-secondary/30 ${
                      !isActive ? "opacity-60 grayscale-[0.5]" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-foreground font-sans truncate max-w-50">
                        {movie.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-sans">
                        {movie.director}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-primary font-sans">
                        {Array.isArray(movie.category)
                          ? movie.category[0]
                          : movie.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground font-sans">
                      {movie.year}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium font-sans ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`}
                        />
                        {isActive ? "Activa" : "Oculta"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {/* BOTÓN DESACTIVAR/ACTIVAR */}
                        <button
                          onClick={() =>
                            handleToggleStatus(movie.id, movie.status)
                          }
                          disabled={updatingId === movie.id}
                          title={
                            isActive ? "Ocultar película" : "Mostrar película"
                          }
                          className={`p-2 rounded-lg border transition-colors ${
                            isActive
                              ? "border-border text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                              : "border-border text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20"
                          }`}
                        >
                          {updatingId === movie.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>

                        {/* BOTÓN EDITAR */}
                        <button
                          onClick={() =>
                            router.push(`/admin/edit-movie/${movie.id}`)
                          }
                          title="Editar película"
                          className="p-2 rounded-lg border border-border text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary/20"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Paginación se queda igual */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-sans">
            Página {page} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors font-sans ${
                  p === page
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
