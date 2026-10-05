"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type ClientOption = {
  id: string;
  full_name: string;
};

type CreateInvoiceFormProps = {
  projects: Project[];
  clients: ClientOption[];
};

export default function CreateInvoiceForm({
  projects,
  clients,
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

    if (!invoiceNumber.trim()) {
      setError("Invoice number is required.");
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
          invoice_number: invoiceNumber.trim(),
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
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          New Invoice
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create an invoice for a client project.
        </p>
      </div>

      <div>
        <label
          htmlFor="project"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Project
        </label>

        <select
          id="project"
          value={projectId}
          onChange={(event) => setProjectId(event.target.value)}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          <option value="">Select a project</option>

          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="client"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Client
        </label>

        <select
          id="client"
          value={clientId}
          onChange={(event) => setClientId(event.target.value)}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          <option value="">Select a client</option>

          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.full_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="invoiceNumber"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Invoice number
        </label>

        <Input
          id="invoiceNumber"
          label=""
          value={invoiceNumber}
          onChange={(event) =>
            setInvoiceNumber(event.target.value)
          }
          placeholder="INV-001"
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          disabled={isLoading}
          rows={4}
          placeholder="Website design and development"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="amount"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Amount
        </label>

        <Input
          id="amount"
          label=""
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="1500.00"
          disabled={isLoading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="issueDate"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Issue date
          </label>

          <Input
            id="issueDate"
            label=""
            type="date"
            value={issueDate}
            onChange={(event) =>
              setIssueDate(event.target.value)
            }
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="dueDate"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Due date
          </label>

          <Input
            id="dueDate"
            label=""
            type="date"
            value={dueDate}
            onChange={(event) =>
              setDueDate(event.target.value)
            }
            disabled={isLoading}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
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