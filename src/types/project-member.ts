export type ProjectMemberRole =
  | "client"
  | "freelancer";

export type ProjectMember = {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectMemberRole;
  created_at: string;
};