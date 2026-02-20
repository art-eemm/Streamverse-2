export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  category: string;
  description: string;
  shortDescription: string;
  image: string;
  heroImage?: string;
  trailerUrl: string;
  duration: string;
  director: string;
  cast: string[];
  featured?: boolean;
}

export interface MovieDB {
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  joinedDate: string;
  status: "active" | "inactive";
}

export interface ProfileDB {
  id: string;
  first_name: string;
  last_name_paternal: string | null;
  last_name_maternal: string | null;
  email: string;
  role: string;
  created_at: string;
  updated_at: string | null;
}
