"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { PageLoader } from "@/components/common/Loading";

/**
 * Client-side guard for admin routes.
 * Redirects unauthenticated users to /login and non-admins to /.
 * The backend ALSO enforces ADMIN role on every API call — this is a UX
 * layer on top of real server-side authorization.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router  = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.replace("/login"); return; }
    if (user?.role !== "ADMIN") { router.replace("/"); }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || !isAuthenticated || user?.role !== "ADMIN") {
    return <PageLoader />;
  }

  return <>{children}</>;
}
