"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthCard from "@/components/auth/AuthCard";
import FormField from "@/components/ui/FormField";
import Alert from "@/components/ui/Alert";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(Boolean(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password.length === 0) {
      setError("Please enter a new password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setIsUpdated(true);
    } catch {
      setError("Unable to update your password right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <AuthCard>
        <AuthHeader />
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Choose a new password
        </h1>

        {hasSession === null ? (
          <p className="mt-4 text-sm text-gray-500" role="status">
            Verifying your reset link...
          </p>
        ) : !hasSession ? (
          <Alert tone="danger" className="mt-6">
            <p>
              This password reset link is invalid or has expired. Request a new
              link to continue.
            </p>
            <Link
              href="/forgot-password"
              className="mt-3 inline-block font-medium text-current underline underline-offset-4"
            >
              Request a new reset link
            </Link>
          </Alert>
        ) : isUpdated ? (
          <Alert tone="success" className="mt-6">
            <p>
              Your password has been updated. You can now sign in with your new
              password.
            </p>
            <Link
              href="/login"
              className="mt-3 inline-block font-medium text-current underline underline-offset-4"
            >
              Back to sign in
            </Link>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <FormField
              id="password"
              label="New password"
              type="password"
              placeholder="Enter a new password"
              value={password}
              error={error}
              onChange={(event) => setPassword(event.target.value)}
            />

            <FormField
              id="confirm-password"
              label="Confirm new password"
              type="password"
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Updating password..." : "Update password"}
            </Button>
          </form>
        )}
      </AuthCard>
    </div>
  );
}
