import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteFile } from "@/lib/supabase/files";
import { getCurrentUserProfile } from "@/lib/supabase/auth";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
  const profile = await getCurrentUserProfile();

if (!profile) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

if (profile.role !== "freelancer") {
  return NextResponse.json(
    { error: "Only freelancers can delete files" },
    { status: 403 }
  );
}

  try {
    await deleteFile(id);

    return NextResponse.json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting file:", error);

    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}