import type { Invoice, InvoiceStatus } from "@/types";

export function getDisplayInvoiceStatus(
  invoice: Invoice
): InvoiceStatus {
  if (
    invoice.status !== "Paid" &&
    invoice.status !== "Draft" &&
    invoice.due_date < new Date().toISOString().slice(0, 10)
  ) {
    return "Overdue";
  }

  return invoice.status;
}