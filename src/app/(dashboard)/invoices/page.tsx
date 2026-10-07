import Link from "next/link";
import Button from "@/components/ui/Button";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { getInvoices } from "@/lib/supabase/invoices";
import type { InvoiceStatus } from "@/types";
import { getDisplayInvoiceStatus } from "@/lib/invoices";

const statusStyles: Record<InvoiceStatus, string> = {
  Draft: "bg-gray-100 text-gray-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Paid: "bg-green-100 text-green-700",
  Overdue: "bg-red-100 text-red-700",
};

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const [userProfile, invoices] = await Promise.all([
    getCurrentUserProfile(),
    getInvoices(),
  ]);

  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.amount),
    0
  );

  const paidAmount = invoices
    .filter(
      (invoice) => getDisplayInvoiceStatus(invoice) === "Paid"
    )
    .reduce((sum, invoice) => sum + Number(invoice.amount), 0);

  const pendingAmount = invoices
    .filter(
      (invoice) =>
        getDisplayInvoiceStatus(invoice) === "Pending"
    )
    .reduce((sum, invoice) => sum + Number(invoice.amount), 0);

  const overdueAmount = invoices
    .filter(
      (invoice) =>
        getDisplayInvoiceStatus(invoice) === "Overdue"
    )
    .reduce((sum, invoice) => sum + Number(invoice.amount), 0);

  const formatAmount = (amount: number) =>
    `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const validStatuses: InvoiceStatus[] = [
    "Draft",
    "Pending",
    "Paid",
    "Overdue",
  ];

  const selectedStatus = validStatuses.includes(
    status as InvoiceStatus
  )
    ? (status as InvoiceStatus)
    : "All";

  const filteredInvoices =
    selectedStatus === "All"
      ? invoices
      : invoices.filter(
        (invoice) =>
          getDisplayInvoiceStatus(invoice) === selectedStatus
      );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Invoices
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {userProfile?.role === "freelancer"
              ? "Create and track invoices for your client projects."
              : "Review invoices shared with you for your projects."}
          </p>
        </div>

        {userProfile?.role === "freelancer" && (
          <Link href="/invoices/new">
            <Button>New Invoice</Button>
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Total</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatAmount(totalAmount)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            All invoices
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Paid</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatAmount(paidAmount)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Completed payments
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">
            Pending
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatAmount(pendingAmount)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Awaiting payment
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">
            Overdue
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatAmount(overdueAmount)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Past the due date
          </p>
        </div>
      </div>

      {invoices.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/invoices"
            className={`rounded-lg px-3 py-2 text-sm font-medium ${selectedStatus === "All"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            All
          </Link>

          {validStatuses.map((invoiceStatus) => (
            <Link
              key={invoiceStatus}
              href={`/invoices?status=${encodeURIComponent(invoiceStatus)}`}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${selectedStatus === invoiceStatus
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {invoiceStatus}
            </Link>
          ))}
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No invoices yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            {userProfile?.role === "freelancer"
              ? "Create your first invoice to start tracking client payments."
              : "Invoices shared with you will appear here."}
          </p>

          {userProfile?.role === "freelancer" && (
            <div className="mt-5">
              <Link href="/invoices/new">
                <Button>Create your first invoice</Button>
              </Link>
            </div>
          )}
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No {selectedStatus.toLowerCase()} invoices
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            There are no invoices matching this status.
          </p>

          <div className="mt-5">
            <Link href="/invoices">
              <Button variant="secondary">
                View all invoices
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Invoice
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Description
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Amount
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Issue Date
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Due Date
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-t border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {invoice.invoice_number}
                      </Link>
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {invoice.description || "No description"}
                    </td>

                    <td className="px-4 py-4 font-medium text-gray-900">
                      {formatAmount(Number(invoice.amount))}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {formatDate(invoice.issue_date)}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {formatDate(invoice.due_date)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[getDisplayInvoiceStatus(invoice)]}`}
                      >
                        {getDisplayInvoiceStatus(invoice)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}