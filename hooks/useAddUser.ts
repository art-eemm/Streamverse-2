import { useState, FormEvent } from "react";

export function useAddUser() {
  const [form, setForm] = useState({
    firstName: "",
    lastNamePaternal: "",
    lastNameMaternal: "",
    email: "",
    role: "user",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [dbError, setDbError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim())
      newErrors.firstName = "El nombre es obligatorio";
    if (!form.lastNamePaternal.trim())
      newErrors.lastNamePaternal = "El apellido paterno es obligatorio";

    if (!form.email) newErrors.email = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Ingresa un correo válido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setDbError("");
    setSuccess(false);

    if (validate()) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await response.json();

        if (!response.ok)
          throw new Error(data.error || "Error al crear el usuario");

        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);

        setForm({
          firstName: "",
          lastNamePaternal: "",
          lastNameMaternal: "",
          email: "",
          role: "user",
        });
      } catch (error: unknown) {
        setDbError(
          error instanceof Error
            ? error.message
            : "Error desconocido al contactar el servidor",
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return { form, errors, isLoading, dbError, success, update, handleSubmit };
}
