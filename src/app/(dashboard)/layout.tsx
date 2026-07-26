import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardLayout from "@/components/dashboard/Layout";

export default async function Dashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
