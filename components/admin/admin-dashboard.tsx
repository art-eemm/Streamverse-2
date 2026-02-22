"use client";

import { useState } from "react";
import { AdminSidebar, type AdminView } from "./admin-sidebar";
import { DashboardOverview } from "./dashboard-overview";
import { MoviesTable } from "./movies-table";
import { ClientsTable } from "./clients-table";
import { AddMovieForm } from "./add-movie";
import { AddUserForm } from "./add-user";
import { motion, AnimatePresence } from "framer-motion";
import type { Movie, User } from "@/lib/mockData";

interface AdminDashboardProps {
  initialMovies: Movie[];
  initialUsers: User[];
}

export function AdminDashboard({
  initialMovies,
  initialUsers,
}: AdminDashboardProps) {
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardOverview movies={initialMovies} users={initialUsers} />
        );
      case "movies":
        return <MoviesTable movies={initialMovies} />;
      case "users":
        return <ClientsTable initialUsers={initialUsers} />;
      case "add-movie":
        return <AddMovieForm />;
      case "add-user":
        return <AddUserForm />;
      default:
        return (
          <DashboardOverview movies={initialMovies} users={initialUsers} />
        );
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar
        active={activeView}
        onChange={setActiveView}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <h1 className="text-lg font-semibold text-foreground capitalize font-sans">
            {activeView === "add-movie"
              ? "Agregar Película"
              : activeView === "add-user"
                ? "Agregar Usuario"
                : activeView}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-sans">
              StreamVerse Admin
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
