"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClientSearch, {
  type ClientProfile,
} from "@/components/projects/ClientSearch";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

type AddProjectClientFormProps = {
  projectId: string;
};

export default function AddProjectClientForm({
  projectId,
}: AddProjectClientFormProps) {
  const router = useRouter();

  const [selectedClient, setSelectedClient] =
    useState<ClientProfile | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const handleAddClient = async () => {
    if (!selectedClient || isAdding) {
      return;
    }

    setIsAdding(true);
    setError("");

    try {
      const response = await fetch(
        "/api/project-members",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project_id: projectId,
            user_id: selectedClient.id,
            role: "client",
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to add client"
        );
      }

      setSelectedClient(null);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-5">
      <ClientSearch onSelect={setSelectedClient} />

      {selectedClient && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Selected client
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {selectedClient.full_name}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                This client will be given access to this project.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedClient(null)}
              className="text-xs font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              Clear
            </button>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              onClick={() => void handleAddClient()}
              disabled={isAdding}
            >
              {isAdding ? "Adding..." : "Add client"}
            </Button>
          </div>
        </div>
      )}

      {error && (
        <Alert tone="danger">{error}</Alert>
      )}
    </div>
  );
}