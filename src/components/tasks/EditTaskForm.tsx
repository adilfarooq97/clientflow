"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import TextareaField from "@/components/ui/TextareaField";
import Alert from "@/components/ui/Alert";
import type { Task, TaskPriority, TaskStatus } from "@/types";

type EditTaskFormProps = {
  task: Task;
};

export default function EditTaskForm({ task }: EditTaskFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [dueDate, setDueDate] = useState(task.due_date ?? "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          status,
          priority,
          due_date: dueDate || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to update task.");
      }

      router.push(`/projects/${task.project_id}/tasks`);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong."
      );
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormField
        id="task-title"
        label="Task title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={isLoading}
      />

      <TextareaField
        id="task-description"
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        rows={4}
        disabled={isLoading}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="task-status"
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value as TaskStatus)}
          disabled={isLoading}
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Done">Done</option>
        </SelectField>

        <SelectField
          id="task-priority"
          label="Priority"
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value as TaskPriority)
          }
          disabled={isLoading}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </SelectField>
      </div>

      <FormField
        id="task-due-date"
        label="Due date"
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
        disabled={isLoading}
      />

      {error && <Alert tone="danger">{error}</Alert>}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
