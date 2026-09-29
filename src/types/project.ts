export type ProjectStatus =
  | "Planning"
  | "In Progress"
  | "Review"
  | "Completed";

export type Project = {
  id: number;
  name: string;
  description: string;
  progress: number;
  status: ProjectStatus;
  deadline: string;
};