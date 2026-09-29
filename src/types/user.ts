export type UserRole = "freelancer" | "client";

export type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
};