import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Button from "@/components/ui/Button";
import DeleteInvoiceButton from "@/components/invoices/DeleteInvoiceButton";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { getInvoice } from "@/lib/supabase/invoices";
import type { InvoiceStatus } from "@/types";


const statusStyles: Record<InvoiceStatus, string> = {
  Draft: "bg-gray-100 text-gray-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Paid: "bg-green-100 text-green-700",
  Overdue: "bg-red-100 text-red-700",
};

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [userProfile, invoice] = await Promise.all([
    getCurrentUserProfile(),
    getInvoice(id),
  ]);

  if (!userProfile) {
    redirect("/login");
  }

  if (!invoice) {
    notFound();
  }


  const formatAmount = (amount: number) =>
    `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/invoices"
        className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
      >
        ← Back to invoices
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Invoice
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              {invoice.invoice_number}
            </h1>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[invoice.status]}`}
          >
            {invoice.status}
          </span>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Amount
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {formatAmount(Number(invoice.amount))}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Issue date
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {invoice.issue_date}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Due date
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {invoice.due_date}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Client
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              Invoice recipient
            </p>
          </div>
        </div>

        {invoice.description && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Description
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              {invoice.description}
            </p>
          </div>
        )}

        {userProfile.role === "freelancer" && (
          <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-200 pt-6">
            <Link href={`/invoices/${invoice.id}/edit`}>
              <Button>Edit Invoice</Button>
            </Link>

            <DeleteInvoiceButton invoiceId={invoice.id} />
          </div>
        )}
      </div>
    </div>
  );
}