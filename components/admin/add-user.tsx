"use client";

import { ChangeEvent } from "react";
import { User, Mail, Shield, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAddUser } from "@/hooks/useAddUser";
import { FormInput } from "../ui/form-input";

export function AddUserForm() {
  const { form, errors, isLoading, dbError, success, update, handleSubmit } =
    useAddUser();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl pb-10"
    >
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 font-sans">
          Registrar Nuevo Usuario
        </h2>

        {dbError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-sans"
          >
            {dbError}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex gap-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 font-sans"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            <div>
              <h3 className="text-emerald-500 font-semibold mb-1">
                ¡Usuario creado exitosamente!
              </h3>
              <p className="text-sm text-emerald-400">
                Se ha generado una contraseña segura y se ha enviado
                automáticamente al correo del cliente.
              </p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              id="firstName"
              label="Nombre(s)"
              icon={User}
              value={form.firstName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("firstName", e.target.value)
              }
              placeholder="Juan"
              disabled={isLoading}
              error={errors.firstName}
            />

            <FormInput
              id="lastNamePaternal"
              label="Apellido Paterno"
              icon={User}
              value={form.lastNamePaternal}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("lastNamePaternal", e.target.value)
              }
              placeholder="Pérez"
              disabled={isLoading}
              error={errors.lastNamePaternal}
            />

            <FormInput
              id="lastNameMaternal"
              label="Apellido Materno"
              icon={User}
              value={form.lastNameMaternal}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("lastNameMaternal", e.target.value)
              }
              placeholder="Pérez"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="user-email"
              type="email"
              label="Correo Electrónico"
              icon={Mail}
              value={form.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("email", e.target.value)
              }
              placeholder="usuario@ejemplo.com"
              disabled={isLoading}
              error={errors.email}
            />

            <div>
              <label
                htmlFor="user-role"
                className="mb-1.5 block text-sm font-medium text-foreground font-sans"
              >
                Rol
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  id="user-role"
                  value={form.role}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    update("role", e.target.value)
                  }
                  disabled={isLoading}
                  className="w-full rounded-lg border border-border bg-input px-4 py-2.5 pl-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors font-sans appearance-none"
                >
                  <option value="user" className="bg-card">
                    Usuario Regular (User)
                  </option>
                  <option value="admin" className="bg-card">
                    Administrador (Admin)
                  </option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none font-sans"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creando Usuario...
              </>
            ) : (
              "Crear Usuario y Enviar Correo"
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
