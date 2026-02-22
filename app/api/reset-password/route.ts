import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "El correo es obligaotrio" },
        { status: 400 },
      );
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, first_name")
      .eq("email", email.trim())
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ success: true });
    }

    const newRandomPassword = Math.random().toString(36).slice(-8) + "A1!";

    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(profile.id, {
        password: newRandomPassword,
      });

    if (updateError) throw updateError;

    await transporter.sendMail({
      from: `"StreamVerse" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Recuperación de contraseña - StreamVerse",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #3b82f6;">Hola, ${profile.first_name || "Usuario"}</h2>
          <p>Hemos recibido una solicitud para restablecer tu contraseña en StreamVerse.</p>
          <p>Tu <strong>nueva contraseña temporal</strong> es:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <span style="font-family: monospace; font-size: 20px; color: #10b981; font-weight: bold;">${newRandomPassword}</span>
          </div>
          <p>Por favor, inicia sesión con esta nueva contraseña.</p>
          <p>Si no fuiste tú quien solicitó esto, por favor contacta a un administrador.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("ERROR REAL EN EL BACKEND:");
    console.dir(error);

    let errorMessage = "Ocurrió un error interno";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      errorMessage = String(error.message);
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
