import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Inicio de sesión",
  description: "Inicia sesión en tu cuenta",
};

export default function LoginPage() {
  return <LoginForm />;
}
