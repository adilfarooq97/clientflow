import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Button from "@/components/ui/Button";
import DeleteInvoiceButton from "@/components/invoices/DeleteInvoiceButton";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { getInvoice } from "@/lib/supabase/invoices";
import { getMemberProfiles } from "@/lib/supabase/users";
import { getDisplayInvoiceStatus } from "@/lib/invoices";
import StatusBadge from "@/components/ui/StatusBadge";

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

  const clientProfile =
    userProfile.role === "freelancer"
      ? (await getMemberProfiles([invoice.client_id]))[0]
      : userProfile;

  const displayStatus = getDisplayInvoiceStatus(invoice);


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

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/invoices"
        className="inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-gray-900"
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

          <StatusBadge status={displayStatus} />
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
              {formatDate(invoice.issue_date)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Due date
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {formatDate(invoice.due_date)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Client
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {clientProfile?.full_name ?? "Client name unavailable"}
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