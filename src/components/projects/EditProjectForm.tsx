"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import type { Project, ProjectStatus } from "@/types";

type EditProjectFormProps = {
  project: Project;
};

export default function EditProjectForm({
  project,
}: EditProjectFormProps) {
  const router = useRouter();

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(
    project.description
  );
  const [status, setStatus] = useState<ProjectStatus>(
    project.status
  );
  const [progress, setProgress] = useState(
    project.progress.toString()
  );
  const [deadline, setDeadline] = useState(
    project.deadline ?? ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    const progressValue = Number(progress);

    if (
      Number.isNaN(progressValue) ||
      progressValue < 0 ||
      progressValue > 100
    ) {
      setError("Progress must be between 0 and 100.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/projects/${project.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            status,
            progress: progressValue,
            deadline: deadline || null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to update project."
        );
      }

      router.push(`/projects/${project.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update project."
      );

      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <FormField
        id="project-name"
        label="Project name"
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
      />

      <div>
        <label
          htmlFor="description"
          className="text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          rows={4}
          className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm leading-6 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="text-sm font-medium text-gray-700"
        >
          Status
        </label>

        <select
          id="status"
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as ProjectStatus
            )
          }
          className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
        >
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <FormField
        id="progress"
        label="Progress (%)"
        type="number"
        value={progress}
        onChange={(event) =>
          setProgress(event.target.value)
        }
      />

      <div>
        <label
          htmlFor="deadline"
          className="text-sm font-medium text-gray-700"
        >
          Deadline
        </label>

        <input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(event) =>
            setDeadline(event.target.value)
          }
          className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm leading-6 text-red-700">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Saving changes..." : "Save changes"}
      </Button>
    </form>
  );
}