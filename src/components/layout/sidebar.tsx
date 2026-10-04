import Link from "next/link";
import { getCurrentUserProfile } from "@/lib/supabase/auth";

const freelancerNavigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Projects",
    href: "/projects",
  },
];

const clientNavigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
];



export default async function Sidebar() {
  const userProfile = await getCurrentUserProfile();
  const navigation =
  userProfile?.role === "client"
    ? clientNavigation
    : freelancerNavigation;
  return (
    <aside className="w-64 min-h-screen border-r bg-white p-6">
      <h2 className="text-xl font-bold">ClientFlow</h2>

      <nav className="mt-8 flex flex-col gap-2">
        {navigation.map((item) => (
          <Link
            key={item.href} 
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}