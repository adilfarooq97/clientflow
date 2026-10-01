export type ProjectStatus =
  | "Planning"
  | "In Progress"
  | "Review"
  | "Completed";

export type Project = {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  progress: number;
  status: ProjectStatus;
  deadline: string | null;
  created_at: string;
};