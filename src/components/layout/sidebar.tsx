import Link from "next/link";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import SidebarNavigation from "@/components/layout/SidebarNavigation";

const freelancerNavigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Projects",
    href: "/projects",
  },
  {
    label: "Invoices",
    href: "/invoices",
  },
  {
    label: "Clients",
    href: "/clients",
  },
  {
    label: "Settings",
    href: "/settings",
  },
];

const clientNavigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Projects",
    href: "/projects",
  },
  {
    label: "Invoices",
    href: "/invoices",
  },
  {
    label: "Settings",
    href: "/settings",
  },
];

export default async function Sidebar() {
  const userProfile = await getCurrentUserProfile();

  const navigation =
    userProfile?.role === "client"
      ? clientNavigation
      : freelancerNavigation;

  return (
    <aside className="shrink-0 border-b border-border bg-surface px-4 py-3 sm:px-6 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:block">
        <Link
          href="/dashboard"
          className="w-fit rounded text-lg font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info"
        >
          ClientFlow
        </Link>

        <div className="-mx-4 sm:mx-0 lg:mt-8">
          <SidebarNavigation items={navigation} />
        </div>
      </div>
    </aside>
  );
}