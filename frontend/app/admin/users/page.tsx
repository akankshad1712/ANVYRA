"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import { ChevronLeft, ChevronRight, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "users", { search, page }],
    queryFn: () => adminService.listUsers({ search: search || undefined, page, size: 20 }),
  });

  const users      = data?.content    ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div>
      <AdminBreadcrumb crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Users" }]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04]">Users</h1>
          <p className="text-sm text-[#A0673A] mt-0.5">{data?.totalElements ?? 0} customers</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0673A]" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search by name or email…"
          className="w-full rounded-lg border border-[#D6CCBF] bg-white pl-9 pr-4 py-2 text-sm text-[#3D1A0A] focus:border-[#C4956A] focus:outline-none"
        />
      </div>

      <div className="rounded-2xl border border-[#D6CCBF] bg-white overflow-hidden">
        {isError ? (
          <div className="p-6 text-sm text-red-700 bg-red-50">
            Failed to load users. Please refresh the page.
          </div>
        ) : isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-[#EDE8E0]" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Users className="h-12 w-12 text-[#C4956A]/50 mb-4" />
            <p className="font-semibold text-[#3D1A0A]">No users found</p>
            {search && <p className="text-sm text-[#A0673A] mt-1">Try a different search term.</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#EDE8E0] bg-[#F7F3EE]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE8E0]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F7F3EE] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#EDE8E0] text-xs font-semibold text-[#5C2E1A]">
                          {u.firstName[0]}{u.lastName[0]}
                        </div>
                        <p className="font-medium text-[#3D1A0A]">{u.firstName} {u.lastName}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#A0673A]">{u.email}</td>
                    <td className="px-4 py-3 text-[#A0673A]">{u.phoneNumber ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        u.role === "ADMIN"
                          ? "bg-[#C4956A]/20 text-[#5C2E1A]"
                          : "bg-[#EDE8E0] text-[#A0673A]"
                      )}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        u.enabled ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      )}>
                        {u.enabled ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#A0673A] text-xs">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
            className="rounded-full border border-[#D6CCBF] bg-white p-2 text-[#5C2E1A] disabled:opacity-40 hover:border-[#C4956A] transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-[#A0673A]">{page + 1} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="rounded-full border border-[#D6CCBF] bg-white p-2 text-[#5C2E1A] disabled:opacity-40 hover:border-[#C4956A] transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
