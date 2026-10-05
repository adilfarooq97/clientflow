"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

type UploadFileFormProps = {
  projectId: string;
};

export default function UploadFileForm({
  projectId,
}: UploadFileFormProps) {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!file) {
      setError("Please select a file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File must be smaller than 10MB.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("project_id", projectId);
      formData.append("file", file);

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response
  .json()
  .catch(() => null);

if (!response.ok) {
  setError(
    data?.error || "Failed to upload file."
  );
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
          Upload File
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Upload a project file directly to ClientFlow.
        </p>
      </div>

      <div>
        <label
          htmlFor="file"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Select file
        </label>

        <input
          id="file"
          type="file"
          onChange={(event) =>
            setFile(event.target.files?.[0] ?? null)
          }
          disabled={isLoading}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium"
        />

        <p className="mt-2 text-xs text-gray-500">
          Maximum file size: 10MB
        </p>
      </div>

      {file && (
        <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
          <p className="font-medium text-gray-900">
            {file.name}
          </p>

          <p className="mt-1">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload File"}
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