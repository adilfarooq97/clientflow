"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import TextareaField from "@/components/ui/TextareaField";
import Alert from "@/components/ui/Alert";
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

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Project name is required.");
      return;
    }

    if (trimmedName.length > 200) {
      setError("Project name must be 200 characters or fewer.");
      return;
    }

    if (trimmedDescription.length > 5000) {
      setError("Description must be 5,000 characters or fewer.");
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
            name: trimmedName,
            description: trimmedDescription,
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

      <TextareaField
        id="description"
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        rows={4}
        maxLength={5000}
        helperText={`${description.length}/5000 characters`}
      />

      <SelectField
        id="status"
        label="Status"
        value={status}
        onChange={(event) =>
          setStatus(event.target.value as ProjectStatus)
        }
      >
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Completed">Completed</option>
      </SelectField>

      <FormField
        id="progress"
        label="Progress (%)"
        type="number"
        value={progress}
        onChange={(event) =>
          setProgress(event.target.value)
        }
      />

      <FormField
        id="deadline"
        label="Deadline"
        type="date"
        value={deadline}
        onChange={(event) => setDeadline(event.target.value)}
      />

      {error && (
        <Alert tone="danger">{error}</Alert>
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