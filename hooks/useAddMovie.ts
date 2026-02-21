import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useAddMovie() {
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
