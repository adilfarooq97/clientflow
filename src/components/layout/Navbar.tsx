import NotificationCenter from "@/components/notifications/NotificationCenter";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function Navbar() {
  const userProfile = await getCurrentUserProfile();
  const fullName = userProfile?.full_name.trim() || "Your account";
  const initials = fullName.charAt(0).toUpperCase();

  return (
    <header className="flex min-h-16 items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Workspace
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <NotificationCenter />

        <div className="flex items-center gap-2">
          <div
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-white"
          >
            {initials}
          </div>

          <span className="hidden max-w-40 truncate text-sm font-medium text-foreground sm:block">
            {fullName}
          </span>
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}