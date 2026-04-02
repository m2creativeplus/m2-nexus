import { Sidebar } from "@/components/Sidebar";
import { RightPanel } from "@/components/RightPanel";
import { Header } from "@/components/Header";
import { SystemStatusBar } from "@/components/SystemStatusBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-[var(--m2-void)] min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 md:ml-[260px] xl:mr-[340px] min-h-screen">
        <Header />
        <SystemStatusBar />
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
      <div className="hidden xl:block">
        <RightPanel />
      </div>
    </div>
  );
}
