import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar user={session.user} />
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}
