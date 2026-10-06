import { NextResponse } from "next/server";
import { markNotificationAsRead } from "@/lib/supabase/notifications";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;

  try {
    const notification =
      await markNotificationAsRead(id);

    return NextResponse.json(notification);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to update notification.";

    if (message === "Unauthorized.") {
      return NextResponse.json(
        { error: message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}