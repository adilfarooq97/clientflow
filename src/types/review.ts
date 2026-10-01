export type ReviewStatus =
  | "Pending"
  | "Approved"
  | "Changes Requested";

export type Review = {
  id: string;
  project_id: string;
  title: string;
  description: string;
  file_url: string | null;
  status: ReviewStatus;
  client_comment: string;
  created_at: string;
  updated_at: string;
};