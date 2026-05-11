"use client";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[220px] flex flex-col">
        <TopBar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
