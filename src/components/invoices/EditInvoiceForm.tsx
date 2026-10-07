"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Invoice, InvoiceStatus } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type EditInvoiceFormProps = {
  invoice: Invoice;
};

const statuses: InvoiceStatus[] = [
  "Draft",
  "Pending",
  "Paid",
  "Overdue",
];

export default function EditInvoiceForm({
  invoice,
}: EditInvoiceFormProps) {
  const router = useRouter();

  const [invoiceNumber, setInvoiceNumber] = useState(
    invoice.invoice_number
  );
  const [description, setDescription] = useState(
    invoice.description
  );
  const [amount, setAmount] = useState(
    String(invoice.amount)
  );
  const [status, setStatus] = useState<InvoiceStatus>(
    invoice.status
  );
  const [issueDate, setIssueDate] = useState(
    invoice.issue_date
  );
  const [dueDate, setDueDate] = useState(
    invoice.due_date
  );

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

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
      const response = await fetch(
        `/api/invoices/${invoice.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoice_number: trimmedInvoiceNumber,
            description: description.trim(),
            amount: numericAmount,
            status,
            issue_date: issueDate,
            due_date: dueDate,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to update invoice."
        );
      }

      router.push(`/invoices/${invoice.id}`);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update invoice."
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
          Edit Invoice
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update the invoice details and payment status.
        </p>
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
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Status
        </label>

        <select
          id="status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as InvoiceStatus)
          }
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          {statuses.map((invoiceStatus) => (
            <option
              key={invoiceStatus}
              value={invoiceStatus}
            >
              {invoiceStatus}
            </option>
          ))}
        </select>
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
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          disabled={isLoading}
          onClick={() =>
            router.push(`/invoices/${invoice.id}`)
          }
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}