"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthCard from "@/components/auth/AuthCard";
import FormField from "@/components/ui/FormField";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <AuthCard>
        <AuthHeader />
        <h1 className="text-2xl font-bold text-gray-900">
          Reset your password
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter your email and we&apos;ll help you reset your password.
        </p>

        {isSubmitted ? (
          <div className="mt-6 rounded-lg bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">
              Check your email
            </p>

            <p className="mt-1 text-sm text-green-700">
              We've sent a password reset link to{" "}
              {email}.
            </p>
          </div>
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

        <div className="mt-7 text-center">
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