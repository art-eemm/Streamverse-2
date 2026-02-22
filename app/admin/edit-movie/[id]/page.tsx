import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { EditMovieForm } from "@/components/admin/edit-movie";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

type DbImage = { url: string; type: string };
type DbCategory = { categories: { name: string } | null };
type DbCast = { cast: { name: string } | null };

export default async function EditMoviePage({ params }: EditPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/home");

  const { data: movie, error } = await supabase
    .from("movies")
    .select(
      `
      *,
      movie_categories(categories(name)),
      movie_cast(cast(name)),
      images(url, type)
    `,
    )
    .eq("id", id)
    .single();

  if (error || !movie) {
    notFound();
  }

  const initialData = {
    id: movie.id,
    title: movie.title,
    director: movie.director,
    year: movie.year.toString(),
    duration: movie.duration,
    rating: movie.rating?.toString() || "",
    description: movie.description,
    imageUrl: movie.image_url,
    trailerUrl: movie.trailer_url,
    featured: movie.featured || false,
    categories:
      movie.movie_categories
        ?.map((mc: DbCategory) => mc.categories?.name)
        .filter(Boolean)
        .join(", ") || "",
    cast:
      movie.movie_cast
        ?.map((mc: DbCast) => mc.cast?.name)
        .filter(Boolean)
        .join(", ") || "",
    heroImageUrls:
      movie.images
        ?.filter((img: DbImage) => img.type === "hero")
        .map((img: DbImage) => img.url)
        .join("\n") || "",
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      <EditMovieForm initialData={initialData} />
    </div>
  );
}
