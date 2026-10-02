import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { removeProjectMember } from "@/lib/supabase/project-members";

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
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

  const { id } = await params;

  try {
    await removeProjectMember(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Remove project member error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to remove project member" },
      { status: 500 }
    );
  }
}