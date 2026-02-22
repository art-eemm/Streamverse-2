import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileDB, type MovieDB, type User } from "@/lib/mockData";
import { formatMoviesFromDB } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin Dashboard - StreamVerse",
  description: "Administra la plataform",
};

export default async function AdminPage() {
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

  if (profile?.role !== "admin") {
    redirect("/home");
  }

  const { data: moviesDB, error: moviesError } = await supabase
    .from("movies")
    .select(
      `*,
        images(url, type),
        movie_categories(categories(name)),
        movie_cast(cast(name))`,
    )
    .returns<MovieDB[]>();

  if (moviesError) console.error("Error DB Películas:", moviesError);

  const formattedMovies = formatMoviesFromDB(moviesDB);

  const uniqueMovies = Array.from(
    new Map(formattedMovies.map((m) => [m.id, m])).values(),
  );

  const { data: usersDB, error: usersError } = await supabase
    .from("profiles")
    .select("*")
    .returns<ProfileDB[]>();

  if (usersError) console.error("Error DB Usuarios:", usersError);

  const allUsers: User[] =
    usersDB?.map((u) => ({
      id: u.id,
      name: `${u.first_name} ${u.last_name_paternal || ""}`,
      email: u.email,
      role: u.role as "admin" | "user",
      joinedDate: new Date(u.created_at).toISOString().split("T")[0],
      status: u.status === 0 ? "inactive" : "active",
    })) || [];

  return (
    <AdminDashboard initialMovies={uniqueMovies} initialUsers={allUsers} />
  );
}
