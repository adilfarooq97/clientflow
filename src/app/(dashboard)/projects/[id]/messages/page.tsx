import Link from "next/link";
import { notFound } from "next/navigation";
import { getAccessibleProjects } from "@/lib/supabase/projects";
import { getMessages } from "@/lib/supabase/messages";
import { getCurrentUser } from "@/lib/supabase/auth";
import MessageThread from "@/components/messages/MessageThread";
import ProjectNavigation from "@/components/projects/ProjectNavigation";
import PageHeader from "@/components/ui/PageHeader";

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const projects = await getAccessibleProjects();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  const [messages, user] = await Promise.all([
    getMessages(project.id),
    getCurrentUser(),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Link
          href={`/projects/${project.id}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to project
        </Link>
        <ProjectNavigation projectId={project.id} />
        <PageHeader
          title="Messages"
          description={`${project.name} · Project conversation`}
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="font-semibold text-gray-900">
            Conversation
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {messages.length === 0
              ? "No messages yet"
              : `${messages.length} ${messages.length === 1 ? "message" : "messages"
              }`}
          </p>
        </div>

        <MessageThread
          projectId={project.id}
          currentUserId={user.id}
          initialMessages={messages}
          canSend={true}
        />


      </div>
    </div>
  );
}