import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { cn } from "@/lib/utils";

export function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:flex md:shrink-0">
        <Sidebar />
      </div>

      <MobileSidebar />

      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300"
        )}
      >
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="animate-fade-in p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
