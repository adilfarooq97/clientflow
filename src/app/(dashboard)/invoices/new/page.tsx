import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { getProjects } from "@/lib/supabase/projects";
import { getProjectMembers } from "@/lib/supabase/project-members";
import { getMemberProfiles } from "@/lib/supabase/users";
import CreateInvoiceForm from "@/components/invoices/CreateInvoiceForm";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";

export default async function NewInvoicePage() {
  const userProfile = await getCurrentUserProfile();

  if (!userProfile) {
    redirect("/login");
  }

  if (userProfile.role !== "freelancer") {
    redirect("/invoices");
  }

  const projects = await getProjects();

  const projectsWithClients = await Promise.all(
    projects.map(async (project) => {
      const members = await getProjectMembers(project.id);

      const clientIds = members
        .filter((member) => member.role === "client")
        .map((member) => member.user_id);

      const clientProfiles =
        clientIds.length > 0
          ? await getMemberProfiles(clientIds)
          : [];

      return {
        ...project,
        clients: clientProfiles
          .filter((profile) => profile.role === "client")
          .map((profile) => ({
            id: profile.id,
            full_name: profile.full_name,
          })),
      };
    })
  );
  const invoiceProjects = projectsWithClients.filter(
    (project) => project.clients.length > 0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create invoice"
        eyebrow="Invoices"
        description="Create an invoice for a client project."
      />

      {invoiceProjects.length === 0 ? (
        <div className="max-w-2xl rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold tracking-tight text-gray-900">
            {projects.length === 0
              ? "Create a project before invoicing"
              : "Add a client before invoicing"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {projects.length === 0
              ? "Invoices are created for client projects. Create a project first, then add a client to it."
              : "Add a client to one of your projects before creating an invoice."}
          </p>

          <div className="mt-5">
            <Link
              href={projects.length === 0 ? "/projects/new" : "/projects"}
            >
              <Button>
                {projects.length === 0
                  ? "Create Project"
                  : "View Projects"}
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <CreateInvoiceForm projects={invoiceProjects} />
      )}
    </div>
  );
}