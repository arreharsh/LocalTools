import AdminShell from "../components/AdminShell";

export const metadata = {
  title: "Admin Dashboard - LocalTools",
  description: "Overview of administrative metrics and statistics.",
};

export default function AdminDashboard() {
  return (
    <AdminShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Users" value="—" />
        <StatCard title="Pro Users" value="—" />
        <StatCard title="Tool Runs Today" value="—" />
      </div>
    </div>
    </AdminShell>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-sm text-muted-foreground">
        {title}
      </p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

