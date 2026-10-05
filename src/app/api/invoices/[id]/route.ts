import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import type { InvoiceStatus } from "@/types";

const allowedStatuses: InvoiceStatus[] = [
  "Draft",
  "Pending",
  "Paid",
  "Overdue",
];

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  const profile = await getCurrentUserProfile();

  if (profile?.role !== "freelancer") {
    return NextResponse.json(
      { error: "Only freelancers can update invoices." },
      { status: 403 }
    );
  }

  const { data: invoice, error: invoiceError } =
    await supabase
      .from("invoices")
      .select("id, project_id")
      .eq("id", id)
      .maybeSingle();

  if (invoiceError) {
    console.error(
      "Error fetching invoice:",
      invoiceError
    );

    return NextResponse.json(
      { error: "Unable to verify invoice." },
      { status: 500 }
    );
  }

  if (!invoice) {
    return NextResponse.json(
      { error: "Invoice not found." },
      { status: 404 }
    );
  }

  const { data: project, error: projectError } =
    await supabase
      .from("projects")
      .select("id")
      .eq("id", invoice.project_id)
      .eq("owner_id", user.id)
      .maybeSingle();

  if (projectError) {
    console.error(
      "Error checking invoice project:",
      projectError
    );

    return NextResponse.json(
      { error: "Unable to verify project access." },
      { status: 500 }
    );
  }

  if (!project) {
    return NextResponse.json(
      { error: "You do not own this project." },
      { status: 403 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const {
    invoice_number,
    description,
    amount,
    status,
    issue_date,
    due_date,
  } = body as Record<string, unknown>;

  if (
    typeof invoice_number !== "string" ||
    !invoice_number.trim()
  ) {
    return NextResponse.json(
      { error: "Invoice number is required." },
      { status: 400 }
    );
  }

  if (invoice_number.trim().length > 100) {
    return NextResponse.json(
      { error: "Invoice number must be 100 characters or less." },
      { status: 400 }
    );
  }

  if (typeof description !== "string") {
    return NextResponse.json(
      { error: "Description must be a string." },
      { status: 400 }
    );
  }

  if (description.length > 5000) {
    return NextResponse.json(
      { error: "Description must be 5000 characters or less." },
      { status: 400 }
    );
  }

  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount < 0
  ) {
    return NextResponse.json(
      { error: "Amount must be a valid non-negative number." },
      { status: 400 }
    );
  }

  if (
    typeof status !== "string" ||
    !allowedStatuses.includes(status as InvoiceStatus)
  ) {
    return NextResponse.json(
      { error: "Invalid invoice status." },
      { status: 400 }
    );
  }

  if (
    typeof issue_date !== "string" ||
    !issue_date.trim()
  ) {
    return NextResponse.json(
      { error: "Issue date is required." },
      { status: 400 }
    );
  }

  if (
    typeof due_date !== "string" ||
    !due_date.trim()
  ) {
    return NextResponse.json(
      { error: "Due date is required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("invoices")
    .update({
      invoice_number: invoice_number.trim(),
      description: description.trim(),
      amount,
      status,
      issue_date: issue_date.trim(),
      due_date: due_date.trim(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating invoice:", error);

    return NextResponse.json(
      { error: "Unable to update invoice." },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  const profile = await getCurrentUserProfile();

  if (profile?.role !== "freelancer") {
    return NextResponse.json(
      { error: "Only freelancers can delete invoices." },
      { status: 403 }
    );
  }

  const { data: invoice, error: invoiceError } =
    await supabase
      .from("invoices")
      .select("id, project_id")
      .eq("id", id)
      .maybeSingle();

  if (invoiceError) {
    console.error(
      "Error fetching invoice:",
      invoiceError
    );

    return NextResponse.json(
      { error: "Unable to verify invoice." },
      { status: 500 }
    );
  }

  if (!invoice) {
    return NextResponse.json(
      { error: "Invoice not found." },
      { status: 404 }
    );
  }

  const { data: project, error: projectError } =
    await supabase
      .from("projects")
      .select("id")
      .eq("id", invoice.project_id)
      .eq("owner_id", user.id)
      .maybeSingle();

  if (projectError) {
    console.error(
      "Error checking invoice project:",
      projectError
    );

    return NextResponse.json(
      { error: "Unable to verify project access." },
      { status: 500 }
    );
  }

  if (!project) {
    return NextResponse.json(
      { error: "You do not own this project." },
      { status: 403 }
    );
  }

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting invoice:", error);

    return NextResponse.json(
      { error: "Unable to delete invoice." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}