import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Page from "@/containers/Page";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <Page
      search={true}
      parameters={["status"]}
      statusCards={false}
      extraFilter={false}
    />
  );
}
