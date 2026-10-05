import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { getProjects } from "@/lib/supabase/projects";
import { getProjectMembers } from "@/lib/supabase/project-members";
import { getMemberProfiles } from "@/lib/supabase/users";
import CreateInvoiceForm from "@/components/invoices/CreateInvoiceForm";

export default async function NewInvoicePage() {
  const userProfile = await getCurrentUserProfile();

  if (!userProfile) {
    redirect("/login");
  }

  if (userProfile.role !== "freelancer") {
    redirect("/invoices");
  }

  const projects = await getProjects();

  const memberLists = await Promise.all(
    projects.map((project) =>
      getProjectMembers(project.id)
    )
  );

  const clientIds = memberLists
    .flat()
    .filter((member) => member.role === "client")
    .map((member) => member.user_id);

  const uniqueClientIds = [...new Set(clientIds)];

  const clientProfiles =
    uniqueClientIds.length > 0
      ? await getMemberProfiles(uniqueClientIds)
      : [];

  const clients = clientProfiles
    .filter((profile) => profile.role === "client")
    .map((profile) => ({
      id: profile.id,
      full_name: profile.full_name,
    }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-gray-500">
          Invoices
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
          Create invoice
        </h1>
      </div>

      <CreateInvoiceForm
        projects={projects}
        clients={clients}
      />
    </div>
  );
}