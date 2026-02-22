"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/lib/mockData";

const ITEMS_PER_PAGE = 8;

interface ClientsTableProps {
  initialUsers: User[];
}

export function ClientsTable({ initialUsers }: ClientsTableProps) {
  const router = useRouter();
  const supabase = createClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = initialUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    setUpdatingId(id);
    try {
      const newStatus = currentStatus === "active" ? 0 : 1;

      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error("Error al actualizar estado del usuario:", error);
      alert("Ocurrió un error al intentar cambiar el estado del usuario.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar usuarios por nombre o correo..."
            className="w-full rounded-lg border border-border bg-input px-4 py-2 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
          />
        </div>
        <p className="text-sm text-muted-foreground font-sans">
          {filtered.length} usuarios
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider font-sans">
                  Usuario
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider font-sans">
                  Rol
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider font-sans">
                  Fecha de Registro
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider font-sans">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider font-sans">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user) => {
                const isActive = user.status === "active";
                const isAdmin = user.role === "admin";

                return (
                  <tr
                    key={user.id}
                    className={`border-b border-border last:border-0 transition-colors hover:bg-secondary/30 ${
                      !isActive ? "opacity-60 grayscale-[0.5]" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-foreground font-sans truncate max-w-50">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-sans truncate max-w-50">
                        {user.email}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium font-sans ${
                          isAdmin
                            ? "bg-purple-500/10 text-purple-500"
                            : "bg-blue-500/10 text-blue-500"
                        }`}
                      >
                        {isAdmin ? (
                          <Shield className="h-3 w-3" />
                        ) : (
                          <UserIcon className="h-3 w-3" />
                        )}
                        {isAdmin ? "Administrador" : "Usuario"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground font-sans">
                      {user.joinedDate}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium font-sans ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`}
                        />
                        {isActive ? "Activo" : "Bloqueado"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {/* BOTÓN BLOQUEAR/DESBLOQUEAR */}
                        <button
                          onClick={() =>
                            handleToggleStatus(user.id, user.status)
                          }
                          disabled={updatingId === user.id || isAdmin}
                          title={
                            isAdmin
                              ? "No puedes bloquear a un administrador"
                              : isActive
                                ? "Bloquear acceso"
                                : "Restaurar acceso"
                          }
                          className={`p-2 rounded-lg border transition-colors ${
                            isAdmin
                              ? "opacity-50 cursor-not-allowed border-border text-muted-foreground"
                              : isActive
                                ? "border-border text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                                : "border-border text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20"
                          }`}
                        >
                          {updatingId === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-sans">
            Página {page} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors font-sans ${
                  p === page
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
