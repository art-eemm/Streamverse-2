import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

interface MovieDB {
  id: number;
  title: string;
  year: number;
  rating: number;
  description: string;
  short_description: string;
  image_url: string | null;
  trailer_url: string;
  duration: string;
  director: string;
  featured: boolean;
  status: number;
  images: { url: string; type: string }[];
  movie_categories: { categories: { name: string } | null }[];
  movie_cast: { cast: { name: string } | null }[];
}

export async function GET(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json(
      { error: "Falta el token de autorización" },
      { status: 401 },
    );
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json(
      { error: "Token inválido o expirado" },
      { status: 401 },
    );
  }

  const { data: moviesDB, error } = await supabase
    .from("movies")
    .select(
      `
      *,
      images(url, type),
      movie_categories(categories(name)),
      movie_cast(cast(name))
    `,
    )
    .eq("status", 1)
    .returns<MovieDB[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const movies =
    moviesDB?.map((m) => {
      const heroImgObj =
        m.images?.find((img) => img.type?.toLowerCase().trim() === "hero") ||
        m.images?.[0];
      const firstCategory =
        m.movie_categories?.[0]?.categories?.name || "General";
      const castList =
        m.movie_cast
          ?.map((mc) => mc.cast?.name)
          .filter((n): n is string => !!n) || [];

      return {
        id: m.id.toString(),
        title: m.title,
        year: Number(m.year),
        rating: m.rating,
        category: firstCategory,
        description: m.description,
        shortDescription: m.short_description,
        image: m.image_url || null,
        heroImage: heroImgObj?.url || m.image_url || null,
        trailerUrl: m.trailer_url,
        duration: m.duration,
        director: m.director,
        cast: castList,
        featured: m.featured,
      };
    }) || [];

  return NextResponse.json(movies);
}
