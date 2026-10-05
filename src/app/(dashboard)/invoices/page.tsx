import Link from "next/link";
import Button from "@/components/ui/Button";
import { getCurrentUserProfile } from "@/lib/supabase/auth";

export default async function InvoicesPage() {
  const userProfile = await getCurrentUserProfile();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Invoices
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Create and track invoices for your client projects.
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
          <p className="text-sm font-medium text-gray-500">
            Total
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            $0
          </p>

          <p className="mt-1 text-xs text-gray-500">
            All invoices
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">
            Paid
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            $0
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
            $0
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
            $0
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Past the due date
          </p>
        </div>
      </div>

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
    </div>
  );
}