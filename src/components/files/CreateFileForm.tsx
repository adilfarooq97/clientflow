"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FileType } from "@/types";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import Alert from "@/components/ui/Alert";

type CreateFileFormProps = {
  projectId: string;
};

export default function CreateFileForm({
  projectId,
}: CreateFileFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState<FileType>("other");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("File name is required.");
      return;
    }

    if (!fileUrl.trim()) {
      setError("File URL is required.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          name: name.trim(),
          file_url: fileUrl.trim(),
          file_type: fileType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add file.");
        return;
      }

      router.push(`/projects/${projectId}/files`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-6"
    >
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Add File
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a file or external deliverable to this project.
        </p>
      </div>

      <FormField
        id="name"
        label="File name"
        value={name}
        disabled={isLoading}
        onChange={(event) => setName(event.target.value)}
        placeholder="Homepage design"
      />

      <FormField
        id="fileUrl"
        label="File URL"
        type="url"
        value={fileUrl}
        disabled={isLoading}
        onChange={(event) => setFileUrl(event.target.value)}
        placeholder="https://..."
      />

      <SelectField
          id="fileType"
          label="File type"
          value={fileType}
          onChange={(event) =>
            setFileType(event.target.value as FileType)
          }
          disabled={isLoading}
        >
          <option value="image">Image</option>
          <option value="document">Document</option>
          <option value="video">Video</option>
          <option value="other">Other</option>
      </SelectField>

      {error && (
        <Alert tone="danger">{error}</Alert>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add File"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          disabled={isLoading}
          onClick={() =>
            router.push(`/projects/${projectId}/files`)
          }
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}