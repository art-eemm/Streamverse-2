"use client";

import { useState, useEffect } from "react";
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
import { createClient } from "@/lib/supabase/client";
import { filter } from "framer-motion/client";

export function AddMovieForm() {
  const [form, setForm] = useState({
    title: "",
    director: "",
    year: "",
    duration: "",
    rating: "",
    category: "",
    description: "",
    cast: "",
    imageUrl: "",
    heroImageUrl: "",
    trailerUrl: "",
    featured: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dbError, setDbError] = useState("");
  const [dbCategories, setDbCategories] = useState<string[]>([]);

  const supabase = createClient();

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("name")
        .order("name");

      if (data && !error) {
        setDbCategories(data.map((cat) => cat.name));
      } else {
        console.error("Error al cargar categorías:", error);
      }
    }

    fetchCategories();
  }, [supabase]);

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "El título es requerido";
    if (!form.director.trim()) newErrors.director = "El director es requerido";
    if (!form.year.trim()) newErrors.year = "El año es requerido";
    else if (isNaN(Number(form.year)) || Number(form.year) < 1900)
      newErrors.year = "Ingrese un año válido";
    if (!form.duration.trim()) newErrors.duration = "La duración es requerida";
    if (!form.category.trim()) newErrors.category = "La categoría es requerida";
    if (!form.description.trim())
      newErrors.description = "La descripción es requerida";
    if (!form.imageUrl.trim())
      newErrors.imageUrl = "La URL de la imagen es requerida";
    if (!form.trailerUrl.trim())
      newErrors.trailerUrl = "La URL del trailer es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDbError("");

    if (validate()) {
      setIsLoading(true);

      try {
        const { data: newMovie, error: movieError } = await supabase
          .from("movies")
          .insert({
            title: form.title,
            director: form.director,
            year: Number(form.year),
            duration: form.duration,
            rating: Number(form.rating) || 0,
            description: form.description,
            short_description:
              form.description.length > 100
                ? form.description.substring(0, 100) + "..."
                : form.description,
            status: 1,
            image_url: form.imageUrl.trim(),
            featured: form.featured,
            trailer_url: form.trailerUrl.trim(),
          })
          .select("id")
          .single();

        if (movieError) throw movieError;
        const movieId = newMovie.id;

        if (form.heroImageUrl.trim()) {
          const { error: imageError } = await supabase.from("images").insert({
            movie_id: movieId,
            url: form.heroImageUrl.trim(),
            type: "hero",
          });

          if (imageError)
            console.error("Error al guardar imagen hero:", imageError);
        }

        if (form.category) {
          let categoryId;
          const { data: existingCat } = await supabase
            .from("categories")
            .select("id")
            .ilike("name", form.category.trim())
            .single();

          if (existingCat) {
            categoryId = existingCat.id;
          } else {
            const { data: newCat } = await supabase
              .from("categories")
              .insert({ name: form.category.trim() })
              .select("id")
              .single();
            if (newCat) categoryId = newCat.id;
          }

          if (categoryId) {
            await supabase.from("movie_categories").insert({
              movie_id: movieId,
              category_id: categoryId,
            });
          }
        }

        if (form.cast.trim()) {
          const actors = form.cast
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean);

          for (const actor of actors) {
            let castId;
            const { data: existingCast } = await supabase
              .from("cast")
              .select("id")
              .ilike("name", actor)
              .single();

            if (existingCast) {
              castId = existingCast.id;
            } else {
              const { data: newCast } = await supabase
                .from("cast")
                .insert({ name: actor })
                .select("id")
                .single();
              if (newCast) castId = newCast.id;
            }

            if (castId) {
              await supabase.from("movie_cast").insert({
                movie_id: movieId,
                cast_id: castId,
              });
            }
          }
        }

        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setForm({
          title: "",
          director: "",
          year: "",
          duration: "",
          rating: "",
          category: "",
          description: "",
          cast: "",
          imageUrl: "",
          heroImageUrl: "",
          trailerUrl: "",
          featured: false,
        });
      } catch (error: unknown) {
        console.dir(error);

        if (error instanceof Error) {
          setDbError(error.message);
        } else if (
          typeof error === "object" &&
          error !== null &&
          "message" in error
        ) {
          setDbError(String(error.message));
        } else {
          setDbError("Ocurrió un error al guardar la película.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const inputClasses = (field: string) =>
    `w-full rounded-lg border bg-input px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors font-sans ${
      errors[field] ? "border-destructive" : "border-border"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl"
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
            ¡Película guardada exitosamente!
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
          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-sm font-medium text-foreground font-sans"
            >
              Título
            </label>
            <div className="relative">
              <Film className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Ej. Inception"
                className={inputClasses("title")}
                disabled={isLoading}
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-xs text-destructive font-sans">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="director"
              className="mb-1.5 block text-sm font-medium text-foreground font-sans"
            >
              Director
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="director"
                type="text"
                value={form.director}
                onChange={(e) => update("director", e.target.value)}
                placeholder="Nombre del director"
                className={inputClasses("director")}
                disabled={isLoading}
              />
            </div>
            {errors.director && (
              <p className="mt-1 text-xs text-destructive font-sans">
                {errors.director}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="year"
                className="mb-1.5 block text-sm font-medium text-foreground font-sans"
              >
                Año
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="year"
                  type="text"
                  value={form.year}
                  onChange={(e) => update("year", e.target.value)}
                  placeholder="2025"
                  className={inputClasses("year")}
                  disabled={isLoading}
                />
              </div>
              {errors.year && (
                <p className="mt-1 text-xs text-destructive font-sans">
                  {errors.year}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="duration"
                className="mb-1.5 block text-sm font-medium text-foreground font-sans"
              >
                Duración
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="duration"
                  type="text"
                  value={form.duration}
                  onChange={(e) => update("duration", e.target.value)}
                  placeholder="2h 15min"
                  className={inputClasses("duration")}
                  disabled={isLoading}
                />
              </div>
              {errors.duration && (
                <p className="mt-1 text-xs text-destructive font-sans">
                  {errors.duration}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="rating"
                className="mb-1.5 block text-sm font-medium text-foreground font-sans"
              >
                Calificación (Opcional)
              </label>
              <div className="relative">
                <Star className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="rating"
                  type="text"
                  value={form.rating}
                  onChange={(e) => update("rating", e.target.value)}
                  placeholder="8.5"
                  className={`w-full rounded-lg border border-border bg-input px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors font-sans`}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="category"
                className="mb-1.5 block text-sm font-medium text-foreground font-sans"
              >
                Categoría
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="category"
                  list="categories-list"
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  disabled={isLoading}
                  placeholder="Ej. Acción"
                  className={`w-full rounded-lg border bg-input px-4 py-2.5 pl-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors font-sans ${
                    errors.category ? "border-destructive" : "border-border"
                  }`}
                />

                <datalist id="categories-list">
                  {dbCategories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
              {errors.category && (
                <p className="mt-1 text-xs text-destructive font-sans">
                  {errors.category}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="cast"
              className="mb-1.5 block text-sm font-medium text-foreground font-sans"
            >
              Elenco (Separado por comas, opcional)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="cast"
                type="text"
                value={form.cast}
                onChange={(e) => update("cast", e.target.value)}
                placeholder="Actor 1, Actor 2, Actor 3"
                className="w-full rounded-lg border border-border bg-input px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors font-sans"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="imageUrl"
                className="mb-1.5 block text-sm font-medium text-foreground font-sans"
              >
                URL del Póster (Principal)
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="imageUrl"
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => update("imageUrl", e.target.value)}
                  placeholder="https://ejemplo.com/poster.jpg"
                  className={inputClasses("imageUrl")}
                  disabled={isLoading}
                />
              </div>
              {errors.imageUrl && (
                <p className="mt-1 text-xs text-destructive font-sans">
                  {errors.imageUrl}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="heroImageUrl"
                className="mb-1.5 block text-sm font-medium text-foreground font-sans"
              >
                URL Banner Hero (Opcional)
              </label>
              <div className="relative">
                <Layout className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="heroImageUrl"
                  type="url"
                  value={form.heroImageUrl}
                  onChange={(e) => update("heroImageUrl", e.target.value)}
                  placeholder="https://ejemplo.com/hero.jpg"
                  className="w-full rounded-lg border border-border bg-input px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors font-sans"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="trailerUrl"
              className="mb-1.5 block text-sm font-medium text-foreground font-sans"
            >
              URL del Tráiler
            </label>
            <div className="relative">
              <Video className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="trailerUrl"
                type="url"
                value={form.trailerUrl}
                onChange={(e) => update("trailerUrl", e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className={inputClasses("trailerUrl")}
                disabled={isLoading}
              />
            </div>
            {errors.trailerUrl && (
              <p className="mt-1 text-xs text-destructive font-sans">
                {errors.trailerUrl}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium text-foreground font-sans"
            >
              Descripción
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Descripción de la película..."
                rows={4}
                disabled={isLoading}
                className={`w-full rounded-lg border bg-input px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none font-sans ${
                  errors.description ? "border-destructive" : "border-border"
                }`}
              />
            </div>
            {errors.description && (
              <p className="mt-1 text-xs text-destructive font-sans">
                {errors.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-border bg-input/50 p-4">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => update("featured", e.target.checked)}
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
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none font-sans"
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
