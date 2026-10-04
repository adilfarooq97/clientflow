"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthCard from "@/components/auth/AuthCard";
import FormField from "@/components/ui/FormField";
import type { UserRole } from "@/types";
import { supabase } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("freelancer");

  const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  if (!name || !email || !password) {
    return;
  }

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
    console.error("Signup error:", error);
    return;
  }

  console.log("Signup successful:", data);
  console.log("User profile data:", {
    name,
    role,
  });
};

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <AuthCard>
         <AuthHeader />
        <h1 className="text-2xl font-bold text-gray-900">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-gray-500">
           Create your ClientFlow account and get started.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <FormField
            id="name"
            label="Full name"
            placeholder="Alex Johnson"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <div>
            <label
              htmlFor="role"
              className="text-sm font-medium text-gray-700"
            >
              I am a
            </label>

            <select
              id="role"
              value={role}
              onChange={(event) =>
                 setRole(event.target.value as UserRole)
              }
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            >
              <option value="freelancer">Freelancer / Agency</option>
              <option value="client">Client</option>
            </select>
          </div>

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

          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
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