import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { getInvoicesForUser } from "@/lib/supabase/invoices";
import { isValidInvoiceDateRange } from "@/lib/invoices";

export async function GET() {
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

  const { data, error } = await getInvoicesForUser(user.id);

  if (error) {
    console.error("Error fetching invoices:", error);

    return NextResponse.json(
      { error: "Unable to fetch invoices." },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
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
      { error: "Only freelancers can create invoices." },
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
    project_id,
    client_id,
    invoice_number,
    description,
    amount,
    issue_date,
    due_date,
  } = body as Record<string, unknown>;

  if (
    typeof project_id !== "string" ||
    !project_id.trim()
  ) {
    return NextResponse.json(
      { error: "Project is required." },
      { status: 400 }
    );
  }

  if (
    typeof client_id !== "string" ||
    !client_id.trim()
  ) {
    return NextResponse.json(
      { error: "Client is required." },
      { status: 400 }
    );
  }

  if (
    typeof invoice_number !== "string" ||
    !invoice_number.trim()
  ) {
    return NextResponse.json(
      { error: "Invoice number is required." },
      { status: 400 }
    );
  }

  if (invoice_number.trim().length > 50) {
  return NextResponse.json(
    { error: "Invoice number must be 50 characters or less." },
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

  if (!isValidInvoiceDateRange(issue_date, due_date)) {
    return NextResponse.json(
      {
        error:
          "Dates must be valid calendar dates, and the due date cannot be before the issue date.",
      },
      { status: 400 }
    );
  }

  const { data: project, error: projectError } =
    await supabase
      .from("projects")
      .select("id")
      .eq("id", project_id)
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

  const { data: client, error: clientError } =
    await supabase
      .from("project_members")
      .select("id")
      .eq("project_id", project_id)
      .eq("user_id", client_id)
      .eq("role", "client")
      .maybeSingle();

  if (clientError) {
    console.error(
      "Error checking invoice client:",
      clientError
    );

    return NextResponse.json(
      { error: "Unable to verify client access." },
      { status: 500 }
    );
  }

  if (!client) {
    return NextResponse.json(
      { error: "Selected client is not a member of this project." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("invoices")
    .insert({
      project_id: project_id.trim(),
      client_id: client_id.trim(),
      invoice_number: invoice_number.trim(),
      description: description.trim(),
      amount,
      status: "Draft",
      issue_date: issue_date.trim(),
      due_date: due_date.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating invoice:", error);

    return NextResponse.json(
      { error: "Unable to create invoice." },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}