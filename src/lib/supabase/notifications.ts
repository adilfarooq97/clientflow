import { createClient } from "@/lib/supabase/server";

export type NotificationType =
  | "review"
  | "message"
  | "task"
  | "invoice";

export type Notification = {
  id: string;
  user_id: string;
  project_id: string | null;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export async function getNotifications(): Promise<Notification[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      "Error fetching notifications:",
      error
    );

    throw new Error("Unable to fetch notifications.");
  }

  return data as Notification[];
}

export async function createNotification(notification: {
  user_id: string;
  project_id?: string | null;
  type: NotificationType;
  title: string;
  message?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: notification.user_id,
      project_id: notification.project_id ?? null,
      type: notification.type,
      title: notification.title,
      message: notification.message ?? "",
    })
    .select()
    .single();

  if (error) {
    console.error(
      "Error creating notification:",
      error
    );

    throw new Error(error.message);
  }

  return data as Notification;
}

export async function markNotificationAsRead(
  notificationId: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error(
      "Error marking notification as read:",
      error
    );

    throw new Error(error.message);
  }

  return data as Notification;
}