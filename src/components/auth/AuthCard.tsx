type AuthCardProps = {
  children: React.ReactNode;
};

export default function AuthCard({
  children,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-xl border bg-white p-8">
      {children}
    </div>
  );
}