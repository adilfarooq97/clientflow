import { notFound, redirect } from "next/navigation";
import EditInvoiceForm from "@/components/invoices/EditInvoiceForm";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { getInvoice } from "@/lib/supabase/invoices";
import PageHeader from "@/components/ui/PageHeader";

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
      <PageHeader
        title="Edit invoice"
        eyebrow={`Invoice ${invoice.invoice_number}`}
        description="Update the invoice details and payment status."
      />

      <EditInvoiceForm invoice={invoice} />
    </div>
  );
}