"use client";

import {
  LayoutDashboard,
  Film,
  Users,
  PlusCircle,
  UserPlus,
  ChevronLeft,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export type AdminView =
  | "dashboard"
  | "movies"
  | "users"
  | "add-movie"
  | "add-user";

interface AdminSidebarProps {
  active: AdminView;
  onChange: (view: AdminView) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems: { id: AdminView; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "movies", label: "Películas", icon: Film },
  { id: "users", label: "Usuarios", icon: Users },
  { id: "add-movie", label: "Agregar Película", icon: PlusCircle },
  { id: "add-user", label: "Agregar Usuario", icon: UserPlus },
];

export function AdminSidebar({
  active,
  onChange,
  isCollapsed,
  onToggle,
}: AdminSidebarProps) {
  return (
    <aside
      className={`flex flex-col border-r border-border bg-card transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-60"
      }`}
    >
      <div
        className={`flex items-center p-4 border-b border-border h-[65px] ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <Link href={"/home"} className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-foreground font-sans">
                  Stream<span className="text-blue-400">Verse</span>
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onToggle}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label={isCollapsed ? "Mostrar Sidebar" : "Ocultar Sidebar"}
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onChange(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all font-sans ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className={`border-t border-border p-4 flex ${isCollapsed ? "justify-center" : ""}`}
      >
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <span className="text-xs font-medium text-primary font-sans">A</span>
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0, marginLeft: 0 }}
              animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
              exit={{ opacity: 0, width: 0, marginLeft: 0 }}
              className="overflow-hidden whitespace-nowrap flex flex-col justify-center"
            >
              <p className="text-sm font-medium text-foreground truncate font-sans">
                Admin
              </p>
              <p className="text-xs text-muted-foreground truncate font-sans">
                admin@gmail.com
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
