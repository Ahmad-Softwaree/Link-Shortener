import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserLinks } from "@/actions/links";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Fetch user's links
  const result = await getUserLinks();
  const links = result.success ? result.data : [];

  return <DashboardContent links={links} />;
}
