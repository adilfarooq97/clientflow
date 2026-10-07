"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import CreateFileForm from "@/components/files/CreateFileForm";
import UploadFileForm from "@/components/files/UploadFileForm";

type ProjectFileFormProps = {
  projectId: string;
};

export default function ProjectFileForm({
  projectId,
}: ProjectFileFormProps) {
  const [source, setSource] = useState<"upload" | "link">("upload");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" aria-label="File source">
        <Button
          type="button"
          variant={source === "upload" ? "primary" : "secondary"}
          aria-pressed={source === "upload"}
          onClick={() => setSource("upload")}
        >
          Upload a file
        </Button>
        <Button
          type="button"
          variant={source === "link" ? "primary" : "secondary"}
          aria-pressed={source === "link"}
          onClick={() => setSource("link")}
        >
          Add an external link
        </Button>
      </div>

      {source === "upload" ? (
        <UploadFileForm projectId={projectId} />
      ) : (
        <CreateFileForm projectId={projectId} />
      )}
    </div>
  );
}
