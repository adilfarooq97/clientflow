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
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/users/clients?search=${encodeURIComponent(
            trimmedSearch
          )}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to search clients");
        }

        const data = await response.json();

        setClients(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Client search error:", error);
        setClients([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search]);

  const visibleClients = search.trim() ? clients : [];
  const showLoading = Boolean(search.trim()) && isLoading;

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

      {showLoading && (
        <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
          <p className="text-sm text-gray-500">
            Searching for clients...
          </p>
        </div>
      )}

      {!showLoading &&
        search.trim() &&
        visibleClients.length === 0 && (
          <p className="text-sm text-gray-500">
            No clients found.
          </p>
        )}

      {visibleClients.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          {visibleClients.map((client) => (
            <button
              key={client.id}
              type="button"
              onClick={() => {
                onSelect(client);
                setSearch("");
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