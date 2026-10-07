import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <section className="rounded-xl border border-dashed border-border bg-surface px-5 py-8 text-center sm:px-8 sm:py-10">
      <h2 className="text-base font-semibold tracking-tight text-foreground">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </section>
  );
}
