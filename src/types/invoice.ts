export type InvoiceStatus =
  | "Draft"
  | "Pending"
  | "Paid"
  | "Overdue";

export type Invoice = {
  id: string;
  project_id: string;
  client_id: string;
  invoice_number: string;
  description: string;
  amount: number;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  created_at: string;
};