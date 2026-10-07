import Link from "next/link";

export default function AuthHeader() {
  return (
    <div className="mb-8 text-center">
      <Link
        href="/"
        className="text-2xl font-bold tracking-tight text-gray-900"
      >
        Souqivo
      </Link>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        One workspace from kickoff to approval.
      </p>
    </div>
  );
}