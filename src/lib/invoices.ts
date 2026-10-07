import type { Invoice, InvoiceStatus } from "@/types";

export function isValidInvoiceDateRange(
  issueDate: string,
  dueDate: string
): boolean {
  const isCalendarDate = (date: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    !Number.isNaN(Date.parse(`${date}T00:00:00.000Z`)) &&
    new Date(`${date}T00:00:00.000Z`)
      .toISOString()
      .startsWith(date);

  return (
    isCalendarDate(issueDate) &&
    isCalendarDate(dueDate) &&
    dueDate >= issueDate
  );
}

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