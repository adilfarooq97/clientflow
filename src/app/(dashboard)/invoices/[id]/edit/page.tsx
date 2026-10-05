import { notFound, redirect } from "next/navigation";
import EditInvoiceForm from "@/components/invoices/EditInvoiceForm";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { getInvoice } from "@/lib/supabase/invoices";

export default async function EditInvoicePage({
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

  if (userProfile.role !== "freelancer") {
    redirect(`/invoices/${id}`);
  }

  if (!invoice) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-gray-500">
          Invoice {invoice.invoice_number}
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
          Edit Invoice
        </h1>
      </div>

      <EditInvoiceForm invoice={invoice} />
    </div>
  );
}