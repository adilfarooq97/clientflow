import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { searchClients } from "@/lib/supabase/users";

export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";

  if (!search.trim()) {
    return NextResponse.json([]);
  }

  const clients = await searchClients(search);

  return NextResponse.json(clients);
}