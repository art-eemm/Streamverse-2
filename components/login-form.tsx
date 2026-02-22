"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [isReseting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [isResetSuccess, setIsResetSuccess] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ingresa un correo válido";
    }
    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (validate()) {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrors({ form: "Credenciales incorrectas o error en el servidor" });
        setLoading(false);
      } else {
        router.refresh();
        router.push("/home");
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({
        email: "Ingresa tu correo válido arriba para recuperar tu cuenta",
      });
      return;
    }

    setIsResetting(true);
    setResetMessage("");
    setIsResetSuccess(false);
    setErrors({});

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error desconocido");

      setIsResetSuccess(true);
      setResetMessage("Te enviamos una nueva contraseña.");
    } catch (error: unknown) {
      let errorMessage = "Ocurrió un error inesperado";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = String(error.message);
      }

      setIsResetSuccess(false);
      setResetMessage(`Error: ${errorMessage}`);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 flex items-center justify-center gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Stream<span className="text-blue-400">Verse</span>
          </span>
        </div>

        <div className="rounded-xl border border-border bg-blue-400/5 p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-foreground font-sans">
              Bienvendio
            </h1>
            <p className="mt-1 text-sm text-muted-foreground font-sans">
              Inicia sesión en tu cuenta para continuar
            </p>
          </div>

          <AnimatePresence>
            {resetMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 p-3 rounded-lg text-sm font-medium font-sans text-center ${
                  isResetSuccess
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}
              >
                {resetMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-foreground font-sans"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@streamverse.com"
                  className={`w-full rounded-lg border bg-input px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors font-sans ${
                    errors.email ? "border-destructive" : "border-border"
                  }`}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-destructive font-sans"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-foreground font-sans"
              >
                Contraseña
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading || isReseting}
                className="text-xs font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors disabled:opacity-50"
              >
                {isReseting
                  ? "Enviando correo..."
                  : "¿Olvidaste tu contraseña?"}
              </button>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className={`w-full rounded-lg border bg-input px-4 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors font-sans ${
                    errors.password ? "border-destructive" : "border-border"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transform-colors"
                  aria-label={
                    showPassword ? "Esconder contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-destructive font-sans"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {errors.form && (
              <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">
                {errors.form}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-lg bg-blue-500 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-blue-500/90 hover:scale-[1.02] active:sclae-[0.98] font-sans disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Iniciando..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground font-sans">
            {"¿No tienes una cuenta? "}
            <Link
              href={"/register"}
              className="text-blue-400 font-medium hover:underline"
            >
              Registrarse
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
