"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/types";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import TextareaField from "@/components/ui/TextareaField";
import Alert from "@/components/ui/Alert";

type ClientOption = {
  id: string;
  full_name: string;
};

type ProjectOption = Project & {
  clients: ClientOption[];
};

type CreateInvoiceFormProps = {
  projects: ProjectOption[];
};

export default function CreateInvoiceForm({
  projects,
}: CreateInvoiceFormProps) {
  const router = useRouter();

  const [projectId, setProjectId] = useState("");
  const [clientId, setClientId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedProject = projects.find(
    (project) => project.id === projectId
  );

  const clients = selectedProject?.clients ?? [];

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!projectId) {
      setError("Please select a project.");
      return;
    }

    if (!clientId) {
      setError("Please select a client.");
      return;
    }

    const trimmedInvoiceNumber = invoiceNumber.trim();

    if (!trimmedInvoiceNumber) {
      setError("Invoice number is required.");
      return;
    }

    if (trimmedInvoiceNumber.length > 50) {
      setError("Invoice number must be 50 characters or fewer.");
      return;
    }

    const numericAmount = Number(amount);

    if (
      !amount.trim() ||
      !Number.isFinite(numericAmount) ||
      numericAmount < 0
    ) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!issueDate) {
      setError("Issue date is required.");
      return;
    }

    if (!dueDate) {
      setError("Due date is required.");
      return;
    }

    if (dueDate < issueDate) {
      setError("Due date cannot be before the issue date.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          client_id: clientId,
          invoice_number: trimmedInvoiceNumber,
          description: description.trim(),
          amount: numericAmount,
          issue_date: issueDate,
          due_date: dueDate,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to create invoice."
        );
      }

      router.push("/invoices");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create invoice."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-6"
    >
      <SelectField
          id="project"
          label="Project"
          value={projectId}
          onChange={(event) => {
            setProjectId(event.target.value);
            setClientId("");
          }}
          disabled={isLoading}
        >
          <option value="">Select a project</option>

          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
      </SelectField>

      <SelectField
          id="client"
          label="Client"
          value={clientId}
          onChange={(event) => setClientId(event.target.value)}
          disabled={isLoading}
        >
          <option value="">Select a client</option>

          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.full_name}
            </option>
          ))}
      </SelectField>

      <FormField
          id="invoiceNumber"
          label="Invoice number"
          value={invoiceNumber}
          onChange={(event) =>
            setInvoiceNumber(event.target.value)
          }
          placeholder="INV-001"
          disabled={isLoading}
        />

      <TextareaField
          id="description"
          label="Description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          disabled={isLoading}
          rows={4}
          placeholder="Website design and development"
        />

      <FormField
          id="amount"
          label="Amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="1500.00"
          disabled={isLoading}
        />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
            id="issueDate"
            label="Issue date"
            type="date"
            value={issueDate}
            onChange={(event) =>
              setIssueDate(event.target.value)
            }
            disabled={isLoading}
          />

        <FormField
            id="dueDate"
            label="Due date"
            type="date"
            value={dueDate}
            onChange={(event) =>
              setDueDate(event.target.value)
            }
            disabled={isLoading}
          />
      </div>

      {error && (
        <Alert tone="danger">{error}</Alert>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Invoice"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          disabled={isLoading}
          onClick={() => router.push("/invoices")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}