import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ClipboardCheck,
  FileText,
  FolderKanban,
  Layers3,
  MessageSquareText,
  ReceiptText,
  Sparkles,
  UsersRound,
} from "lucide-react";
import ProductPreview from "@/components/marketing/ProductPreview";

const features = [
  {
    icon: FolderKanban,
    title: "Projects with context",
    description:
      "Keep the brief, people, progress, and day-to-day work together from kickoff.",
  },
  {
    icon: ClipboardCheck,
    title: "A clear task board",
    description:
      "Organize tasks by status and priority so everyone can see what is moving.",
  },
  {
    icon: Sparkles,
    title: "Reviews that move work forward",
    description:
      "Share a deliverable, collect a response, and track approval or requested changes.",
  },
  {
    icon: FileText,
    title: "Project files in reach",
    description:
      "Share uploads and links with the people who have access to the project.",
  },
  {
    icon: MessageSquareText,
    title: "Conversation by project",
    description:
      "Keep messages close to the client work they are about.",
  },
  {
    icon: ReceiptText,
    title: "Invoices alongside the work",
    description:
      "Create and manage project invoices in the same workspace.",
  },
];

const workflow = [
  {
    number: "01",
    title: "Kick off",
    description: "Create a project and bring your client into the workspace.",
  },
  {
    number: "02",
    title: "Organize",
    description: "Break the work into tasks and make progress visible.",
  },
  {
    number: "03",
    title: "Share",
    description: "Keep project files and deliverables accessible in context.",
  },
  {
    number: "04",
    title: "Review",
    description: "Collect feedback, approval, or a request for changes.",
  },
  {
    number: "05",
    title: "Communicate",
    description: "Keep project conversations connected to the work.",
  },
  {
    number: "06",
    title: "Invoice",
    description: "Manage project invoices from the same workspace.",
  },
];

const freelancerBenefits = [
  "See projects, tasks, and feedback in one place",
  "Give clients a clear view of progress and deliverables",
  "Keep project conversations and invoices close to the work",
];

const clientBenefits = [
  "Know what is in progress and what needs your attention",
  "Review deliverables and respond with approval or changes",
  "Find project files, messages, and invoices in context",
];

const actionLinkClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-transparent bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-offset-2";

const secondaryLinkClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-offset-2";

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-7 space-y-4">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-muted text-success">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <>
      <header className="border-b border-border bg-surface">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 md:min-h-16 md:flex-row md:items-center md:justify-between md:gap-4 md:py-0 lg:px-8"
        >
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="rounded text-lg font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info"
            >
              ClientFlow
            </Link>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info"
              >
                Sign in
              </Link>
              <Link href="/signup" className={`${actionLinkClass} min-h-10 px-3 sm:px-4`}>
                Get started
              </Link>
            </div>
          </div>

          <div className="hidden items-center gap-7 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#workflow"
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              How it works
            </Link>
            <Link
              href="#for-clients"
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              For clients
            </Link>
          </div>

          <div className="flex items-center gap-5 border-t border-border pt-2 md:hidden">
            <Link
              href="#features"
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#workflow"
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              How it works
            </Link>
            <Link
              href="#for-clients"
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              For clients
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="overflow-hidden border-b border-border bg-surface">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-8 lg:py-24">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
                A shared workspace for client projects
              </p>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
                One workspace from kickoff to approval.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Bring project plans, tasks, files, reviews, messages, and
                invoices together for you and your clients.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className={actionLinkClass}>
                  Get started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/login" className={secondaryLinkClass}>
                  Sign in
                </Link>
              </div>

              <p className="mt-4 text-xs leading-5 text-subtle-foreground">
                For freelancers, agencies, and the clients they work with.
              </p>
            </div>

            <div className="min-w-0 lg:pl-2">
              <ProductPreview />
            </div>
          </div>
        </section>

        <section aria-labelledby="value-heading" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
            <div>
              <p className="text-sm font-semibold text-info">One shared place</p>
              <h2 id="value-heading" className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Less scattered work. More shared clarity.
              </h2>
            </div>
            <div className="max-w-2xl">
              <p className="text-base leading-7 text-muted-foreground">
                Client work can quickly spread across task lists, file links,
                feedback threads, and billing. ClientFlow gives each project a
                shared home, so freelancers and clients can find the work and
                context they need without jumping between disconnected spaces.
              </p>
              <Link
                href="#features"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
              >
                Explore the workspace
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section id="features" aria-labelledby="features-heading" className="scroll-mt-8 border-y border-border bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-info">The workspace</p>
              <h2 id="features-heading" className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                The pieces of client work, connected.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Give every project a clear place for planning, collaboration,
                feedback, and billing.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-xl border border-border bg-background p-5 sm:p-6"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-info-muted text-info">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" aria-labelledby="workflow-heading" className="scroll-mt-8 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-info">A natural rhythm</p>
              <h2 id="workflow-heading" className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                From the first brief to the final invoice.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Keep the people, progress, and next steps connected at every
                stage of a client project.
              </p>
            </div>

            <ol className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {workflow.map((step) => (
                <li key={step.number} className="border-t border-border pt-5">
                  <p className="font-mono text-sm font-semibold text-info">
                    {step.number}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="freelancers-heading" className="border-y border-border bg-surface">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
            <div className="max-w-xl">
              <p className="text-sm font-semibold text-info">For freelancers &amp; agencies</p>
              <h2 id="freelancers-heading" className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Make the work easier to manage—and easier to share.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Keep client projects organized, make progress easy to follow,
                and give every client a professional place to collaborate.
              </p>
              <CheckList items={freelancerBenefits} />
              <Link href="/signup" className={`${actionLinkClass} mt-8`}>
                Create your workspace
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="rounded-2xl border border-border bg-background p-5 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-info-muted text-info">
                  <Layers3 className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-foreground">A project stays connected</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Bring the plan, project members, activity, and key details
                    together.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  ["Tasks", "Plan the work"],
                  ["Reviews", "Track feedback"],
                  ["Files", "Share deliverables"],
                  ["Invoices", "Manage billing"],
                ].map(([label, detail]) => (
                  <div key={label} className="rounded-lg border border-border bg-surface p-4">
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="for-clients" aria-labelledby="clients-heading" className="scroll-mt-8 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="order-2 rounded-2xl border border-border bg-surface p-5 sm:p-8 lg:order-1">
              <div className="flex items-center gap-3 border-b border-border pb-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success-muted text-success">
                  <UsersRound className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">A clear client view</p>
                  <p className="mt-1 text-xs text-muted-foreground">Project updates, together</p>
                </div>
              </div>
              <ul className="mt-5 space-y-4">
                {[
                  ["Progress", "See project status and task updates"],
                  ["Reviews", "Respond to work and request changes"],
                  ["Files & messages", "Find shared items in project context"],
                  ["Invoices", "View invoices shared with you"],
                ].map(([label, detail]) => (
                  <li key={label} className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-foreground">{label}</span>
                    <span className="text-right text-xs leading-5 text-muted-foreground">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-1 max-w-xl lg:order-2">
              <p className="text-sm font-semibold text-info">For clients</p>
              <h2 id="clients-heading" className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Stay in the loop without adding another complicated tool.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                See project progress, find shared files, follow conversations,
                and respond when a deliverable is ready for review.
              </p>
              <CheckList items={clientBenefits} />
            </div>
          </div>
        </section>

        <section aria-labelledby="cta-heading" className="border-y border-border bg-surface">
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-14 sm:px-6 sm:py-16 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="max-w-2xl">
              <h2 id="cta-heading" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Bring your next client project into one workspace.
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Start with the project. Keep the collaboration connected.
              </p>
            </div>
            <Link href="/signup" className={`${actionLinkClass} shrink-0`}>
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-start lg:px-8">
          <div className="max-w-sm">
            <Link
              href="/"
              className="rounded text-lg font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info"
            >
              ClientFlow
            </Link>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              One workspace for freelancers, agencies, and clients to move
              project work from kickoff to approval.
            </p>
          </div>
          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
            <Link href="#features" className="text-muted-foreground hover:text-foreground">Features</Link>
            <Link href="#workflow" className="text-muted-foreground hover:text-foreground">How it works</Link>
            <Link href="/login" className="text-muted-foreground hover:text-foreground">Sign in</Link>
            <Link href="/signup" className="text-muted-foreground hover:text-foreground">Create account</Link>
          </nav>
          <p className="border-t border-border pt-5 text-xs text-subtle-foreground md:col-span-2">
            © {new Date().getFullYear()} ClientFlow
          </p>
        </div>
      </footer>
    </>
  );
}
