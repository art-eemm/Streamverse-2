import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useAddMovie() {
  const [form, setForm] = useState({
    title: "",
    director: "",
    year: "",
    duration: "",
    rating: "",
    categories: "",
    description: "",
    cast: "",
    imageUrl: "",
    heroImageUrls: "",
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
    if (!form.title.trim()) newErrors.title = "El título es obligatorio";
    if (!form.director.trim())
      newErrors.director = "El director es obligatorio";
    if (!form.year.trim()) newErrors.year = "El año es obligatorio";
    else if (isNaN(Number(form.year)) || Number(form.year) < 1900)
      newErrors.year = "Ingresa un año válido";
    if (!form.duration.trim())
      newErrors.duration = "La duración es obligatoria";
    if (!form.categories.trim())
      newErrors.categories = "Las categorías son obligatorias";
    if (!form.description.trim())
      newErrors.description = "La descripción es obligatoria";
    if (!form.imageUrl.trim())
      newErrors.imageUrl = "La URL del póster es obligatoria";
    if (!form.trailerUrl.trim())
      newErrors.trailerUrl = "La URL del tráiler es obligatoria";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDbError("");

    if (validate()) {
      setIsLoading(true);

      try {
        // 1. Guardar la película base
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

        // 2. Guardar MÚLTIPLES imágenes Hero (separadas por coma o salto de línea)
        if (form.heroImageUrls.trim()) {
          // split(/[\n,]+/) separa por comas o saltos de línea
          const urls = form.heroImageUrls
            .split(/[\n,]+/)
            .map((u) => u.trim())
            .filter(Boolean);
          for (const url of urls) {
            const { error: imageError } = await supabase.from("images").insert({
              movie_id: movieId,
              url: url,
              type: "hero",
            });
            if (imageError)
              console.error("Error al guardar imagen hero:", imageError);
          }
        }

        // 3. Guardar MÚLTIPLES categorías (separadas por coma)
        if (form.categories.trim()) {
          const cats = form.categories
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);

          for (const catName of cats) {
            let categoryId;
            // Buscar si la categoría ya existe (ignorando mayúsculas/minúsculas)
            const { data: existingCat } = await supabase
              .from("categories")
              .select("id")
              .ilike("name", catName)
              .single();

            if (existingCat) {
              categoryId = existingCat.id;
            } else {
              // Si no existe, crearla
              const { data: newCat } = await supabase
                .from("categories")
                .insert({ name: catName })
                .select("id")
                .single();
              if (newCat) categoryId = newCat.id;
            }

            // Vincular la categoría con la película
            if (categoryId) {
              await supabase.from("movie_categories").insert({
                movie_id: movieId,
                category_id: categoryId,
              });
            }
          }
        }

        // 4. Guardar Elenco (Cast)
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
          categories: "",
          description: "",
          cast: "",
          imageUrl: "",
          heroImageUrls: "",
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

  return {
    form,
    errors,
    submitted,
    isLoading,
    dbError,
    dbCategories,
    update,
    handleSubmit,
  };
}
