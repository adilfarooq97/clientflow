import { getProfileSettings } from "@/lib/supabase/settings";
import ProfileForm from "@/components/settings/ProfileForm";

export default async function SettingsPage() {
  const profile = await getProfileSettings();

  if (!profile) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Settings
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Unable to load your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your profile information.
        </p>
      </div>

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