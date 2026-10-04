import Card from "@/components/ui/Card";

type StatCardProps = {
  title: string;
  value: string;
};

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <Card>
      <p className="text-sm font-medium leading-6 text-gray-500">
        {title}
      </p>

      <p className="text-2xl font-bold tracking-tight text-gray-900">
        {value}
      </p>
    </Card>
  );
}