import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  let body: {
    full_name?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const fullName =
    typeof body.full_name === "string"
      ? body.full_name.trim()
      : "";

  if (!fullName) {
    return NextResponse.json(
      { error: "Full name is required." },
      { status: 400 }
    );
  }

  if (fullName.length > 100) {
    return NextResponse.json(
      { error: "Full name must be 100 characters or less." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
    })
    .eq("id", user.id)
    .select("id, full_name, role")
    .single();

  if (error) {
    console.error(
      "Error updating profile:",
      error
    );

    return NextResponse.json(
      { error: "Unable to update profile." },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}