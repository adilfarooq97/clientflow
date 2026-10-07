import { createClient } from "@/lib/supabase/server";
import type { Invoice, InvoiceStatus } from "@/types";

type InvoiceReadScope = {
  ownedProjectIds: string[];
  clientProjectIds: string[];
};

type InvoiceListResult = {
  data: Invoice[] | null;
  error: unknown | null;
};

async function getInvoiceReadScope(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<{
  data: InvoiceReadScope | null;
  error: unknown | null;
}> {
  const { data: ownedProjects, error: ownedProjectsError } =
    await supabase
      .from("projects")
      .select("id")
      .eq("owner_id", userId);

  if (ownedProjectsError) {
    return { data: null, error: ownedProjectsError };
  }

  const { data: clientMemberships, error: membershipsError } =
    await supabase
      .from("project_members")
      .select("project_id")
      .eq("user_id", userId)
      .eq("role", "client");

  if (membershipsError) {
    return { data: null, error: membershipsError };
  }

  return {
    data: {
      ownedProjectIds: (ownedProjects ?? []).map(
        (project) => project.id
      ),
      clientProjectIds: (clientMemberships ?? []).map(
        (membership) => membership.project_id
      ),
    },
    error: null,
  };
}

async function queryInvoicesForUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<InvoiceListResult> {
  const { data: scope, error: scopeError } =
    await getInvoiceReadScope(supabase, userId);

  if (scopeError || !scope) {
    return { data: null, error: scopeError };
  }

  const invoices: Invoice[] = [];

  if (scope.ownedProjectIds.length > 0) {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .in("project_id", scope.ownedProjectIds);

    if (error) {
      return { data: null, error };
    }

    invoices.push(...(data as Invoice[]));
  }

  if (scope.clientProjectIds.length > 0) {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("client_id", userId)
      .in("project_id", scope.clientProjectIds);

    if (error) {
      return { data: null, error };
    }

    invoices.push(...(data as Invoice[]));
  }

  const uniqueInvoices = Array.from(
    new Map(invoices.map((invoice) => [invoice.id, invoice])).values()
  ).sort((first, second) =>
    second.created_at.localeCompare(first.created_at)
  );

  return { data: uniqueInvoices, error: null };
}

export async function getInvoicesForUser(
  userId: string
): Promise<InvoiceListResult> {
  const supabase = await createClient();

  return queryInvoicesForUser(supabase, userId);
}

export async function getInvoices(): Promise<Invoice[]> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Error fetching invoices:", authError);
    throw new Error("Unable to fetch invoices.");
  }

  if (!user) {
    return [];
  }

  const { data, error } = await queryInvoicesForUser(
    supabase,
    user.id
  );

  if (error) {
    console.error("Error fetching invoices:", error);
    throw new Error("Unable to fetch invoices.");
  }

  return data ?? [];
}

export async function getInvoice(
  invoiceId: string
): Promise<Invoice | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Error fetching invoice:", authError);
    throw new Error("Unable to fetch invoice.");
  }

  if (!user) {
    return null;
  }

  const { data: scope, error: scopeError } =
    await getInvoiceReadScope(supabase, user.id);

  if (scopeError || !scope) {
    console.error("Error fetching invoice:", scopeError);
    throw new Error("Unable to fetch invoice.");
  }

  if (scope.ownedProjectIds.length > 0) {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", invoiceId)
      .in("project_id", scope.ownedProjectIds)
      .maybeSingle();

    if (error) {
      console.error("Error fetching invoice:", error);
      throw new Error("Unable to fetch invoice.");
    }

    if (data) {
      return data as Invoice;
    }
  }

  if (scope.clientProjectIds.length > 0) {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", invoiceId)
      .eq("client_id", user.id)
      .in("project_id", scope.clientProjectIds)
      .maybeSingle();

    if (error) {
      console.error("Error fetching invoice:", error);
      throw new Error("Unable to fetch invoice.");
    }

    return data as Invoice | null;
  }

  return null;
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