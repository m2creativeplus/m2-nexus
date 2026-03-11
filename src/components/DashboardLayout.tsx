import { Sidebar } from "@/components/Sidebar";
import { RightPanel } from "@/components/RightPanel";
import { Header } from "@/components/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="flex-1 ml-[260px] mr-[340px] flex flex-col min-h-screen">
        <Header />
        <div className="flex-1">
          {children}
        </div>
      </div>
      <RightPanel />
    </div>
  );
}
