import { NextResponse } from "next/server";
import { getNotifications } from "@/lib/supabase/notifications";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  const notifications = await getNotifications();

  return NextResponse.json(notifications);
}