import Link from "next/link";
import { notFound } from "next/navigation";
import { getAccessibleProjects } from "@/lib/supabase/projects";
import { getMessages } from "@/lib/supabase/messages";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import MessageThread from "@/components/messages/MessageThread";
import ProjectNavigation from "@/components/projects/ProjectNavigation";

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = await getCurrentUserProfile();
  const projects = await getAccessibleProjects();

  const project = projects.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  const messages = await getMessages(project.id);

  return (
    <div className="space-y-6">
      <Link
        href={`/projects/${project.id}`}
        className="text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back to project
      </Link>

      <ProjectNavigation projectId={project.id} />

      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Project Messages
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {project.name}
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white">
        <MessageThread
          projectId={project.id}
          initialMessages={messages}
          currentUserId={profile?.id ?? ""}
          canSend={true}
        />
      </div>
    </div>
  );
}