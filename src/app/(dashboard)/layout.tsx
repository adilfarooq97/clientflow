import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/Navbar";
import { getCurrentUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const user = await getCurrentUser();

if (!user) {
  redirect("/login");
}
  return (
    <div className="flex min-h-screen">
      <Sidebar />

    <div className="flex flex-1 flex-col">
      <Navbar />
      <LogoutButton />

      <main className="flex-1">
        {children}
      </main>
    </div>
    </div>
  );
}