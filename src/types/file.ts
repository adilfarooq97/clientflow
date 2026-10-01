export type FileType =
  | "image"
  | "document"
  | "video"
  | "other";

export type ProjectFile = {
  id: string;
  project_id: string;
  name: string;
  file_url: string;
  file_type: FileType;
  uploaded_by: string;
  created_at: string;
};