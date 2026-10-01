"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FileType } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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

      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          File name
        </label>

        <Input
          id="name"
          label=""
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Homepage design"
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="fileUrl"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          File URL
        </label>

        <Input
          id="fileUrl"
          label=""
          type="url"
          value={fileUrl}
          onChange={(event) => setFileUrl(event.target.value)}
          placeholder="https://..."
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="fileType"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          File type
        </label>

        <select
          id="fileType"
          value={fileType}
          onChange={(event) =>
            setFileType(event.target.value as FileType)
          }
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          <option value="image">Image</option>
          <option value="document">Document</option>
          <option value="video">Video</option>
          <option value="other">Other</option>
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
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