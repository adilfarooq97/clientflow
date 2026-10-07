import { createClient } from "@/lib/supabase/server";
import type { Message } from "@/types";

export async function getMessages(
  projectId: string
): Promise<Message[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Unable to load project messages.");
  }

  return data as Message[];
}

export async function createMessage(message: {
  project_id: string;
  sender_id: string;
  content: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .insert(message)
    .select()
    .single();

  if (error) {
    console.error("Error creating message:", error);
    throw new Error(error.message);
  }

  return data as Message;
}

export async function deleteMessage(messageId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId);

  if (error) {
    console.error("Error deleting message:", error);
    throw new Error(error.message);
  }
}