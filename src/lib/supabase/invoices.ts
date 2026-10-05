import { createClient } from "@/lib/supabase/server";
import type { Invoice, InvoiceStatus } from "@/types";

export async function getInvoices(): Promise<Invoice[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }

  return data as Invoice[];
}

export async function getInvoice(
  invoiceId: string
): Promise<Invoice | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching invoice:", error);
    return null;
  }

  return data as Invoice | null;
}

export async function createInvoice(invoice: {
  project_id: string;
  client_id: string;
  invoice_number: string;
  description: string;
  amount: number;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .insert(invoice)
    .select()
    .single();

  if (error) {
    console.error("Error creating invoice:", error);
    throw new Error(error.message);
  }

  return data as Invoice;
}

export async function updateInvoice(
  invoiceId: string,
  invoice: {
    invoice_number: string;
    description: string;
    amount: number;
    status: InvoiceStatus;
    issue_date: string;
    due_date: string;
  }
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .update(invoice)
    .eq("id", invoiceId)
    .select()
    .single();

  if (error) {
    console.error("Error updating invoice:", error);
    throw new Error(error.message);
  }

  return data as Invoice;
}

export async function deleteInvoice(invoiceId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", invoiceId);

  if (error) {
    console.error("Error deleting invoice:", error);
    throw new Error(error.message);
  }
}