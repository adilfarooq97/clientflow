"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthCard from "@/components/auth/AuthCard";
import FormField from "@/components/ui/FormField";
import Alert from "@/components/ui/Alert";
import { supabase } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setEmail(trimmedEmail);
      setIsSubmitted(true);
    } catch {
      setError("Unable to send a reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <AuthCard>
        <AuthHeader />
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Reset your password
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter your email and we&apos;ll help you reset your password.
        </p>

        {isSubmitted ? (
          <Alert tone="success" className="mt-6">
            <p className="font-medium">
              Check your email
            </p>

            <p className="mt-1">
              If an account exists for {email}, a password reset link has
              been sent.
            </p>
          </Alert>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >

            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              error={error}
              onChange={(event) => setEmail(event.target.value)}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}