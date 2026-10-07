"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import TextareaField from "@/components/ui/TextareaField";
import Alert from "@/components/ui/Alert";
import type { ProjectStatus } from "@/types";

export default function CreateProjectForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] =
    useState<ProjectStatus>("Planning");
  const [deadline, setDeadline] = useState("");
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

    setIsLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          description: trimmedDescription,
          status,
          progress: 0,
          deadline: deadline || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to create project."
        );
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Unable to create project.");
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
        placeholder="Website Redesign"
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
      />

      <TextareaField
        id="description"
        label="Description (optional)"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Describe the project..."
        rows={4}
        maxLength={5000}
        helperText={`${description.length}/5000 characters`}
      />

      <SelectField
        id="status"
        label="Status (optional)"
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
        id="deadline"
        label="Deadline (optional)"
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
        {isLoading ? "Creating..." : "Create project"}
      </Button>
    </form>
  );
}