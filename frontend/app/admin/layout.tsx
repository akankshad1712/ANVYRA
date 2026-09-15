import type { Metadata } from "next";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ToastProvider } from "@/providers/toast-provider";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: { default: "Admin | ANVYRA", template: "%s · Admin | ANVYRA" },
  robots: { index: false, follow: false },   // keep admin out of search engines
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ToastProvider>
        <AuthProvider>
          <AdminGuard>
            <div className="flex min-h-screen bg-[#F7F3EE]">
              <AdminSidebar />
              {/* Main content — push down on mobile for the fixed top bar */}
              <div className="flex-1 min-w-0 pt-14 lg:pt-0">
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                  {children}
                </div>
              </div>
            </div>
          </AdminGuard>
        </AuthProvider>
      </ToastProvider>
    </QueryProvider>
  );
}
