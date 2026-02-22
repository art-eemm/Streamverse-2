import { type Movie, type MovieDB } from "./mockData";

export function formatMoviesFromDB(
  moviesDB: MovieDB[] | null | undefined,
): Movie[] {
  if (!moviesDB) return [];

  return moviesDB.flatMap((m) => {
    const heroImgObj =
      m.images?.find((img) => img.type?.toLowerCase().trim() === "hero") ||
      m.images?.[0];

    const castList =
      m.movie_cast
        ?.map((mc) => mc.cast?.name)
        .filter((n): n is string => !!n) || [];

    const categoriesFound = m.movie_categories
      ?.map((mc) => mc.categories?.name)
      .filter(Boolean) as string[];

    const categoriesToMap =
      categoriesFound.length > 0 ? categoriesFound : ["General"];

    return categoriesToMap.map((categoryName) => ({
      id: m.id.toString(),
      title: m.title,
      year: Number(m.year),
      rating: m.rating,
      category: categoryName,
      description: m.description,
      shortDescription: m.short_description,
      image: m.image_url || "/placeholder.jpg",
      heroImage: heroImgObj?.url || m.image_url || undefined,
      trailerUrl: m.trailer_url,
      duration: m.duration,
      director: m.director,
      cast: castList,
      featured: m.featured,
      status: m.status,
    }));
  });
}
