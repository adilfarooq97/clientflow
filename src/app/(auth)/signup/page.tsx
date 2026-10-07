"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthCard from "@/components/auth/AuthCard";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import Alert from "@/components/ui/Alert";
import type { UserRole } from "@/types";
import { supabase } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("freelancer");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name || !email || !password) {
      setErrorMessage("Please complete all fields.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        return;
      }

      setSuccessMessage(
        "If your account can be created, a confirmation link will be sent to your email. Already registered? Sign in."
      );
    } catch {
      setErrorMessage(
        "Unable to create your account right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <AuthCard>
        <AuthHeader />
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Create your Souqivo account and get started.
        </p>

        {errorMessage && (
          <Alert tone="danger" className="mt-5">
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert tone="success" className="mt-6">
            {successMessage}
          </Alert>
        )}

        <form
          hidden={Boolean(successMessage)}
          onSubmit={handleSubmit}
          className="mt-7 space-y-5"
        >
          <FormField
            id="name"
            label="Full name"
            placeholder="Alex Johnson"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <SelectField
              id="role"
              label="Account type"
              value={role}
              onChange={(event) =>
                setRole(event.target.value as UserRole)
              }
            >
              <option value="freelancer">Freelancer / Agency</option>
              <option value="client">Client</option>
          </SelectField>

          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-gray-900 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}