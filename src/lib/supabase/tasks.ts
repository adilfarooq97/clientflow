import { createClient } from "@/lib/supabase/server";
import type { Task, TaskPriority, TaskStatus } from "@/types";

export async function getTasks(projectId: string): Promise<Task[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Unable to fetch project tasks.");
  }

  return data as Task[];
}

export async function createTask(task: {
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select()
    .single();

  if (error) {
    console.error("Error creating task:", error);
    throw new Error(error.message);
  }

  return data as Task;
}

export async function updateTask(
  taskId: string,
  task: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    due_date: string | null;
  }
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .update(task)
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    console.error("Error updating task:", error);
    throw new Error(error.message);
  }

  return data as Task;
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (error) {
    console.error("Error deleting task:", error);
    throw new Error(error.message);
  }
}