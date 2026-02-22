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
  ArrowLeft,
  Edit2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEditMovie, type MovieFormData } from "@/hooks/useEditMovie";
import { FormInput, FormTextarea } from "../ui/form-input"; // Asume que exportas FormInput desde add-movie o un archivo ui
import Link from "next/link";

interface EditMovieFormProps {
  initialData: MovieFormData;
}

export function EditMovieForm({ initialData }: EditMovieFormProps) {
  const {
    form,
    errors,
    isLoading,
    dbError,
    dbCategories,
    update,
    handleSubmit,
  } = useEditMovie(initialData);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl pb-10"
    >
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 font-sans"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al panel
      </Link>

      <div className="rounded-xl border border-border bg-card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Edit2 className="h-5 w-5" />{" "}
          </div>
          <h2 className="text-xl font-semibold text-foreground font-sans">
            Editar Película
          </h2>
        </div>

        {dbError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-sans"
          >
            {dbError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="title"
              label="Título"
              icon={Film}
              value={form.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("title", e.target.value)
              }
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
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              id="year"
              label="Año"
              icon={Calendar}
              value={form.year}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("year", e.target.value)
              }
              disabled={isLoading}
            />
            <FormInput
              id="duration"
              label="Duración"
              icon={Clock}
              value={form.duration}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("duration", e.target.value)
              }
              disabled={isLoading}
            />
            <FormInput
              id="rating"
              label="Calificación"
              icon={Star}
              value={form.rating}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("rating", e.target.value)
              }
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormInput
                id="categories"
                label="Categorías (Separadas por comas)"
                icon={Tag}
                value={form.categories}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  update("categories", e.target.value)
                }
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
            <FormInput
              id="cast"
              label="Elenco (Separado por comas)"
              icon={User}
              value={form.cast}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("cast", e.target.value)
              }
              disabled={isLoading}
            />
          </div>

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
              disabled={isLoading}
            />
          </div>

          <FormTextarea
            id="heroImageUrls"
            label="URLs Banners Hero (Separadas por comas o saltos de línea)"
            icon={Layout}
            value={form.heroImageUrls}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              update("heroImageUrls", e.target.value)
            }
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
            rows={4}
            disabled={isLoading}
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
                className="font-medium text-foreground font-sans cursor-pointer"
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
                <Loader2 className="h-4 w-4 animate-spin" /> Guardando
                Cambios...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
