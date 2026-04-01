"use client";

import type { ReactNode } from "react";
import AppSidebar from "@/components/ui/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <main className="flex-1">
          <div className="p-4">
            <SidebarTrigger />
          </div>

          <div>{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}