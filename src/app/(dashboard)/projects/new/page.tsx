import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import CreateProjectForm from "@/components/projects/CreateProjectForm";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";

export default async function NewProjectPage() {
  const profile = await getCurrentUserProfile();

if (!profile) {
  redirect("/login");
}

if (profile.role !== "freelancer") {
  redirect("/dashboard");
}
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to dashboard
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Create a new project
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Add a project to your ClientFlow workspace.
        </p>
      </div>

      <AuthCard>
        <CreateProjectForm />
      </AuthCard>
    </div>
  );
}