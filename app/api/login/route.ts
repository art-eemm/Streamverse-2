import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son obligatorios" },
        { status: 400 },
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("first_name, last_name_paternal, role")
      .eq("id", authData.user.id)
      .single();

    const userRole =
      profileData?.role || authData.user.user_metadata?.role || "user";

    const cleanResponse = {
      token: authData.session.access_token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: userRole, // 'admin' o 'user'
        firstName: profileData?.first_name || "",
        lastName: profileData?.last_name_paternal || "",
      },
    };

    return NextResponse.json(cleanResponse);
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
