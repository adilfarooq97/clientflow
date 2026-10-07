import { getProfileSettings } from "@/lib/supabase/settings";
import ProfileForm from "@/components/settings/ProfileForm";
import PageHeader from "@/components/ui/PageHeader";
import Alert from "@/components/ui/Alert";

export default async function SettingsPage() {
  const profile = await getProfileSettings();

  if (!profile) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Settings
        </h1>

        <div className="mt-4">
          <Alert tone="danger">Unable to load your profile.</Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile information."
      />

      <section className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Profile
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your current account information.
          </p>
        </div>

        <ProfileForm profile={profile} />
      </section>
    </div>
  );
}