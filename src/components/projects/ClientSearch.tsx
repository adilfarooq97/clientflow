"use client";

import { useEffect, useState } from "react";

export type ClientProfile = {
  id: string;
  full_name: string;
  role: "client";
};

type ClientSearchProps = {
  onSelect: (client: ClientProfile) => void;
};

export default function ClientSearch({
  onSelect,
}: ClientSearchProps) {
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      setClients([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/users/clients?search=${encodeURIComponent(
            trimmedSearch
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to search clients");
        }

        const data = await response.json();

        setClients(data);
      } catch (error) {
        console.error("Client search error:", error);
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="space-y-3">
      <label
        htmlFor="client-search"
        className="block text-sm font-medium text-gray-700"
      >
        Search for a client
      </label>

      <input
        id="client-search"
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by client name..."
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
      />

      {isLoading && (
        <p className="text-sm text-gray-500">
          Searching...
        </p>
      )}

      {!isLoading &&
        search.trim() &&
        clients.length === 0 && (
          <p className="text-sm text-gray-500">
            No clients found.
          </p>
        )}

      {clients.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          {clients.map((client) => (
            <button
              key={client.id}
              type="button"
              onClick={() => {
                onSelect(client);
                setSearch("");
                setClients([]);
              }}
              className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {client.full_name}
                </p>

                <p className="text-xs text-gray-500">
                  Client
                </p>
              </div>

              <span className="text-sm font-medium text-gray-500">
                Select
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}