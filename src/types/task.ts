export type TaskStatus =
  | "Todo"
  | "In Progress"
  | "Review"
  | "Done";

export type TaskPriority =
  | "Low"
  | "Medium"
  | "High";

export type Task = {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
};