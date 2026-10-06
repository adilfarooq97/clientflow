"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProfileSettings } from "@/lib/supabase/settings";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type ProfileFormProps = {
  profile: ProfileSettings;
};

export default function ProfileForm({
  profile,
}: ProfileFormProps) {
  const router = useRouter();

  const [fullName, setFullName] = useState(
    profile.full_name
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = fullName.trim();

    if (!trimmedName) {
      setError("Full name is required.");
      return;
    }

    if (trimmedName.length > 100) {
      setError(
        "Full name must be 100 characters or less."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "/api/settings/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: trimmedName,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to update profile."
        );
      }

      setFullName(data.full_name);
      setSuccess("Profile updated successfully.");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update profile."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-5"
    >
      <div>
        <label
          htmlFor="fullName"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Full name
        </label>

        <Input
          id="fullName"
          label=""
          value={fullName}
          onChange={(event) =>
            setFullName(event.target.value)
          }
          disabled={isLoading}
        />
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Role
        </p>

        <p className="mt-1 text-sm font-medium capitalize text-gray-900">
          {profile.role}
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-green-600">
          {success}
        </p>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}