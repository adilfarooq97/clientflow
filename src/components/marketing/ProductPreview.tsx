import {
  ArrowUpRight,
  Check,
  FileText,
  MessageSquareText,
  MoreHorizontal,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import StatusBadge from "@/components/ui/StatusBadge";

const columns = [
  { title: "To do", tasks: ["Content outline", "Mobile layouts"] },
  { title: "In progress", tasks: ["Homepage design"] },
  { title: "Review", tasks: ["Brand direction"] },
];

export default function ProductPreview() {
  return (
    <figure
      aria-label="Illustrative preview of a Souqivo project workspace"
      className="relative mx-auto w-full max-w-2xl rounded-2xl border border-border bg-surface p-2 shadow-xl shadow-slate-900/5 sm:p-3"
    >
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="flex h-11 items-center justify-between border-b border-border bg-surface px-3 sm:px-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/70" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" aria-hidden="true" />
          </div>
          <span className="hidden text-xs font-medium text-subtle-foreground sm:block">
            Example workspace preview
          </span>
          <MoreHorizontal className="h-4 w-4 text-subtle-foreground" aria-hidden="true" />
        </div>

        <div className="grid min-h-[390px] sm:min-h-[440px] sm:grid-cols-[130px_1fr]">
          <aside className="hidden border-r border-border bg-surface p-3 sm:block">
            <p className="truncate text-xs font-semibold text-foreground">Souqivo</p>
            <p className="mt-5 px-2 text-[10px] font-medium uppercase tracking-wider text-subtle-foreground">
              Workspace
            </p>
            <ul className="mt-2 space-y-1 text-xs">
              {["Overview", "Tasks", "Reviews", "Files", "Messages", "Invoices"].map(
                (item, index) => (
                  <li
                    key={item}
                    className={`rounded-md px-2 py-2 ${
                      index === 0
                        ? "bg-info-muted font-medium text-info"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item}
                  </li>
                )
              )}
            </ul>
          </aside>

          <div className="min-w-0 p-3 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wider text-subtle-foreground">
                  Project overview
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-foreground sm:text-base">
                  Website redesign
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Project workspace · Example content
                </p>
              </div>
              <Badge variant="info">In Progress</Badge>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                ["Tasks", "Kanban board"],
                ["Reviews", "Client feedback"],
                ["Files", "Shared deliverables"],
              ].map(([label, detail]) => (
                <div key={label} className="min-w-0 rounded-lg border border-border bg-surface p-2.5 sm:p-3">
                  <p className="truncate text-[10px] font-medium text-muted-foreground sm:text-xs">{label}</p>
                  <p className="mt-1 hidden truncate text-[10px] text-subtle-foreground sm:block">{detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-border bg-surface p-3 sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-foreground sm:text-sm">Task board</p>
                <span className="text-[10px] text-muted-foreground">Organized by status</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {columns.map((column) => (
                  <div key={column.title} className="min-w-0 rounded-md bg-background p-2">
                    <p className="truncate text-[9px] font-semibold text-muted-foreground sm:text-[10px]">
                      {column.title}
                    </p>
                    <div className="mt-2 space-y-1.5">
                      {column.tasks.map((task) => (
                        <div key={task} className="truncate rounded border border-border bg-surface px-1.5 py-2 text-[9px] leading-3 text-foreground sm:px-2 sm:text-[10px]">
                          {task}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-surface p-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-warning-muted text-warning">
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-medium text-foreground">Homepage design</p>
                  <p className="text-[9px] text-muted-foreground">Review submission</p>
                </div>
                <StatusBadge status="Pending" />
              </div>
              <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-surface p-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-success-muted text-success">
                  <MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-medium text-foreground">Project conversation</p>
                  <p className="text-[9px] text-muted-foreground">Messages in context</p>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-subtle-foreground" aria-hidden="true" />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-lg bg-info-muted/60 px-3 py-2 text-[10px] text-info">
              <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Project work, feedback, files, and communication in one place
            </div>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">
        Illustrative project workspace showing a task board, a pending review,
        project messages, files, and invoices.
      </figcaption>
    </figure>
  );
}
