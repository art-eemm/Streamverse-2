import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { firstName, lastNamePaternal, lastNameMaternal, email, role } =
      await request.json();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const randomPassword = Math.random().toString(36).slice(-8) + "A1!";

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: randomPassword,
        email_confirm: true,
      });

    if (authError) throw authError;

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        first_name: firstName.trim(),
        last_name_paternal: lastNamePaternal.trim(),
        last_name_maternal: lastNameMaternal ? lastNameMaternal.trim() : null,
        role: role,
      })
      .eq("id", authData.user.id);

    if (profileError) throw profileError;

    const { error: emailError } = await resend.emails.send({
      from: "StreamVerse <onboarding@resend.dev>",
      to: email,
      subject: "Tus credenciales de acceso a StreamVerse",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #3b82f6;">¡Bienvenido a StreamVerse, ${firstName}!</h2>
          <p>Tu cuenta ha sido creada exitosamente por un administrador.</p>
          <p>Tus credenciales de acceso son las siguientes:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Correo:</strong> ${email}</p>
            <p style="margin: 0;"><strong>Contraseña temporal:</strong> <span style="font-family: monospace; font-size: 16px; color: #10b981;">${randomPassword}</span></p>
          </div>
          <p>Te recomendamos iniciar sesión y cambiar esta contraseña lo antes posible por motivos de seguridad.</p>
          <p>¡Disfruta de todo nuestro contenido!</p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Error al enviar correo:", emailError);
      throw new Error(
        "Usuario creado, pero hubo un problema enviando el correo.",
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("🔴 ERROR REAL EN EL BACKEND:");
    console.dir(error);

    let errorMessage = "Error desconocido";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      errorMessage = String(error.message);
    }

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
