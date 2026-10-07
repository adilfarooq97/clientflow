import Link from "next/link";
import { notFound } from "next/navigation";
import { getAccessibleProjects } from "@/lib/supabase/projects";
import { getFiles, getFileUrl } from "@/lib/supabase/files";
import { isExternalFileUrl } from "@/lib/files";
import FileCard from "@/components/files/FileCard";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import ProjectNavigation from "@/components/projects/ProjectNavigation";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";


export default async function FilesPage({
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

  const files = await getFiles(project.id);

  const filesWithUrls = (
    await Promise.all(
      files.map(async (file) => {
        if (isExternalFileUrl(file.file_url)) {
          return {
            file,
            fileUrl: file.file_url,
          };
        }

        try {
          const signedUrl = await getFileUrl(file.file_url);

          return {
            file,
            fileUrl: signedUrl,
          };
        } catch (error) {
          console.error(
            `Error creating signed URL for file ${file.id}:`,
            error
          );

          return null;
        }
      })
    )
  ).filter(
    (
      item
    ): item is { file: (typeof files)[number]; fileUrl: string } =>
      item !== null
  );
  const unavailableFileCount = files.length - filesWithUrls.length;

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
          title="Files"
          description={`${project.name} · ${
            files.length === 1 ? "1 file" : `${files.length} files`
          }`}
          action={
            profile?.role === "freelancer" ? (
              <Link href={`/projects/${project.id}/files/new`}>
                <Button>Add File</Button>
              </Link>
            ) : undefined
          }
        />
      </div>

      {filesWithUrls.length === 0 ? (
        <EmptyState
          title={files.length === 0 ? "No files yet" : "Files are unavailable"}
          description={
            files.length === 0
              ? profile?.role === "freelancer"
                ? "Add your first project file."
                : "No project files have been uploaded yet."
              : "Some project files could not be loaded. Please try again later."
          }
          action={
            profile?.role === "freelancer" && files.length === 0 ? (
              <Link
                href={`/projects/${project.id}/files/new`}
                className="text-sm font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
              >
                Add a file
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {unavailableFileCount > 0 && (
            <p
              className="rounded-lg bg-warning-muted p-3 text-sm text-warning"
              role="status"
            >
              {unavailableFileCount === 1
                ? "1 file could not be opened. Please try again later."
                : `${unavailableFileCount} files could not be opened. Please try again later.`}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {filesWithUrls.map(({ file, fileUrl }) => (
              <FileCard
                key={file.id}
                file={{
                  ...file,
                  file_url: fileUrl,
                }}
                canManage={profile?.role === "freelancer"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}