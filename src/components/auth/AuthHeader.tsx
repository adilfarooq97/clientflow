import Link from "next/link";

export default function AuthHeader() {
  return (
    <div className="mb-8 text-center">
      <Link
        href="/"
        className="text-2xl font-bold text-gray-900"
      >
        ClientFlow
      </Link>

      <p className="mt-2 text-sm text-gray-500">
        One workspace from kickoff to approval.
      </p>
    </div>
  );
}