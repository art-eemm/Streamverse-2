import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export interface MovieFormData {
  id: string;
  title: string;
  director: string;
  year: string;
  duration: string;
  rating: string;
  categories: string;
  description: string;
  cast: string;
  imageUrl: string;
  heroImageUrls: string;
  trailerUrl: string;
  featured: boolean;
}

export function useEditMovie(initialData: MovieFormData) {
  const router = useRouter();
  const [form, setForm] = useState<MovieFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [dbError, setDbError] = useState("");
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("categories")
        .select("name")
        .order("name");
      if (data) setDbCategories(data.map((cat) => cat.name));
    }
    fetchCategories();
  }, [supabase]);

  const update = (field: keyof MovieFormData, value: string | boolean) => {
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
    if (!form.categories.trim())
      newErrors.categories = "Las categorías son obligatorias";
    if (!form.imageUrl.trim())
      newErrors.imageUrl = "La URL del póster es obligatoria";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDbError("");

    if (validate()) {
      setIsLoading(true);
      try {
        const movieId = form.id;

        const { error: movieError } = await supabase
          .from("movies")
          .update({
            title: form.title,
            director: form.director,
            year: Number(form.year),
            duration: form.duration,
            rating: Number(form.rating) || 0,
            description: form.description,
            image_url: form.imageUrl.trim(),
            featured: form.featured,
            trailer_url: form.trailerUrl.trim(),
            short_description:
              form.description.length > 100
                ? form.description.substring(0, 100) + "..."
                : form.description,
          })
          .eq("id", movieId);
        if (movieError) throw movieError;

        await supabase
          .from("images")
          .delete()
          .eq("movie_id", movieId)
          .eq("type", "hero");
        if (form.heroImageUrls.trim()) {
          const urls = form.heroImageUrls
            .split(/[\n,]+/)
            .map((u) => u.trim())
            .filter(Boolean);
          for (const url of urls) {
            await supabase
              .from("images")
              .insert({ movie_id: movieId, url, type: "hero" });
          }
        }

        await supabase
          .from("movie_categories")
          .delete()
          .eq("movie_id", movieId);
        if (form.categories.trim()) {
          const cats = form.categories
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);
          for (const catName of cats) {
            let categoryId;
            const { data: existingCat } = await supabase
              .from("categories")
              .select("id")
              .ilike("name", catName)
              .single();
            if (existingCat) categoryId = existingCat.id;
            else {
              const { data: newCat } = await supabase
                .from("categories")
                .insert({ name: catName })
                .select("id")
                .single();
              if (newCat) categoryId = newCat.id;
            }
            if (categoryId)
              await supabase
                .from("movie_categories")
                .insert({ movie_id: movieId, category_id: categoryId });
          }
        }

        await supabase.from("movie_cast").delete().eq("movie_id", movieId);
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
            if (existingCast) castId = existingCast.id;
            else {
              const { data: newCast } = await supabase
                .from("cast")
                .insert({ name: actor })
                .select("id")
                .single();
              if (newCast) castId = newCast.id;
            }
            if (castId)
              await supabase
                .from("movie_cast")
                .insert({ movie_id: movieId, cast_id: castId });
          }
        }

        router.push("/admin");
        router.refresh();
      } catch (error: unknown) {
        if (error instanceof Error) {
          setDbError(error.message);
        } else if (
          typeof error === "object" &&
          error !== null &&
          "message" in error
        ) {
          setDbError(String(error.message));
        } else {
          setDbError("Ocurrió un error al actualizar.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    form,
    errors,
    isLoading,
    dbError,
    dbCategories,
    update,
    handleSubmit,
  };
}
