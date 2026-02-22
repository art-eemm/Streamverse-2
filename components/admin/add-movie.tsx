"use client";

import { ChangeEvent } from "react";
import {
  Film,
  User,
  Calendar,
  Clock,
  Star,
  Tag,
  FileText,
  Loader2,
  Image as ImageIcon,
  Layout,
  Video,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAddMovie } from "@/hooks/useAddMovie";
import { FormInput, FormTextarea } from "../ui/form-input";

export function AddMovieForm() {
  const {
    form,
    errors,
    submitted,
    isLoading,
    dbError,
    dbCategories,
    update,
    handleSubmit,
  } = useAddMovie();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl pb-10"
    >
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 font-sans">
          Agregar Nueva Película
        </h2>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400 font-sans"
          >
            ¡Película guardada exitosamente en la base de datos!
          </motion.div>
        )}

        {dbError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-sans"
          >
            {dbError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="title"
              label="Título"
              icon={Film}
              value={form.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("title", e.target.value)
              }
              placeholder="Ej. Inception"
              disabled={isLoading}
              error={errors.title}
            />
            <FormInput
              id="director"
              label="Director"
              icon={User}
              value={form.director}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("director", e.target.value)
              }
              placeholder="Nombre del director"
              disabled={isLoading}
              error={errors.director}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="year"
              label="Año"
              icon={Calendar}
              value={form.year}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("year", e.target.value)
              }
              placeholder="2025"
              disabled={isLoading}
              error={errors.year}
            />
            <FormInput
              id="duration"
              label="Duración"
              icon={Clock}
              value={form.duration}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("duration", e.target.value)
              }
              placeholder="2h 15min"
              disabled={isLoading}
              error={errors.duration}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="rating"
              label="Calificación"
              icon={Star}
              value={form.rating}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("rating", e.target.value)
              }
              placeholder="8.5"
              disabled={isLoading}
            />

            <div>
              <FormInput
                id="categories"
                label="Categorías (Separadas por comas)"
                icon={Tag}
                value={form.categories}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  update("categories", e.target.value)
                }
                placeholder="Ej. Acción, Ciencia Ficción"
                disabled={isLoading}
                error={errors.categories}
                list="categories-list"
              />
              <datalist id="categories-list">
                {dbCategories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          <FormInput
            id="cast"
            label="Elenco (Separado por comas)"
            icon={User}
            value={form.cast}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              update("cast", e.target.value)
            }
            placeholder="Actor 1, Actor 2"
            disabled={isLoading}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="imageUrl"
              type="url"
              label="URL del Póster (Principal)"
              icon={ImageIcon}
              value={form.imageUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("imageUrl", e.target.value)
              }
              placeholder="https://ejemplo.com/poster.jpg"
              disabled={isLoading}
              error={errors.imageUrl}
            />
            <FormInput
              id="trailerUrl"
              type="url"
              label="URL del Tráiler"
              icon={Video}
              value={form.trailerUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("trailerUrl", e.target.value)
              }
              placeholder="https://youtube.com/watch?v=..."
              disabled={isLoading}
              error={errors.trailerUrl}
            />
          </div>

          {/* Múltiples Imágenes Hero usando un Textarea */}
          <FormTextarea
            id="heroImageUrls"
            label="URLs Banners Hero (Separadas por comas o saltos de línea)"
            icon={Layout}
            value={form.heroImageUrls}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              update("heroImageUrls", e.target.value)
            }
            placeholder="https://ejemplo.com/hero1.jpg&#10;https://ejemplo.com/hero2.jpg"
            rows={3}
            disabled={isLoading}
          />

          <FormTextarea
            id="description"
            label="Descripción"
            icon={FileText}
            value={form.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              update("description", e.target.value)
            }
            placeholder="Descripción de la película..."
            rows={3}
            disabled={isLoading}
            error={errors.description}
          />

          <div className="flex items-center gap-3 rounded-lg border border-border bg-input/50 p-4">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("featured", e.target.checked)
              }
              disabled={isLoading}
              className="h-5 w-5 rounded border-border bg-input text-primary focus:ring-2 focus:ring-primary/50"
            />
            <div>
              <label
                htmlFor="featured"
                className="font-medium text-foreground font-sans select-none cursor-pointer"
              >
                Película Destacada
              </label>
              <p className="text-xs text-muted-foreground font-sans">
                Aparecerá en el carrusel principal de la pantalla de inicio.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none font-sans"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
              </>
            ) : (
              "Agregar Película"
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
