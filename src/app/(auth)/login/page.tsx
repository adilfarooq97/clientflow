"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthCard from "@/components/auth/AuthCard";
import FormField from "@/components/ui/FormField";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email) {
      setEmailError("Email is required.");
      hasError = true;
    } else if (!email.includes("@")) {
      setEmailError("Please enter a valid email.");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError(
        "Password must be at least 6 characters."
      );
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      console.error("Login error:", error);
      return;
    }

    router.push("/dashboard");
  };
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <AuthCard>
        <AuthHeader />
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Sign in to continue to your ClientFlow workspace.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            error={emailError}
            onChange={(event) => setEmail(event.target.value)}
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            error={passwordError}
            onChange={(event) => setPassword(event.target.value)}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300"
              />

              Remember me
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full">
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-gray-900 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}