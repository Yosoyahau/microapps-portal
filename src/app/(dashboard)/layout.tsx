import { cookies } from "next/headers";
import { ClientDashboardLayout } from "./ClientDashboardLayout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const showWelcome = cookieStore.get("showWelcome")?.value === "true";

  return (
    <ClientDashboardLayout showWelcome={showWelcome}>
      {children}
    </ClientDashboardLayout>
  );
}
