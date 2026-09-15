"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tag, ShoppingCart,
  Users, Boxes, Menu, X, LogOut,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/admin",           label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/products",  label: "Products",   icon: Package },
  { href: "/admin/categories",label: "Categories", icon: Tag },
  { href: "/admin/orders",    label: "Orders",     icon: ShoppingCart },
  { href: "/admin/users",     label: "Users",      icon: Users },
  { href: "/admin/inventory", label: "Inventory",  icon: Boxes },
];

export default function AdminSidebar() {
  const pathname  = usePathname();
  const [open, setOpen] = useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#5C2E1A]/40">
        <Image src="/logos/anvyra-logo-white.png" alt="ANVYRA" width={110} height={34} className="h-8 w-auto" />
        <span className="text-xs text-[#C4956A] font-semibold uppercase tracking-widest">Admin</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#C4956A] text-[#1C0A04]"
                  : "text-[#D4AF8C] hover:bg-[#3D1A0A] hover:text-[#F7F3EE]"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: store link + logout */}
      <div className="px-3 pb-4 space-y-1 border-t border-[#5C2E1A]/40 pt-3">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#D4AF8C] hover:bg-[#3D1A0A] hover:text-[#F7F3EE] transition-colors">
          <Package className="h-4 w-4" />
          View Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-[#3D1A0A] transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 flex-col bg-[#1C0A04] min-h-screen">
        <NavContent />
      </aside>

      {/* Mobile: top bar with hamburger */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 flex items-center justify-between bg-[#1C0A04] px-4 py-3 border-b border-[#5C2E1A]/40">
        <Image src="/logos/anvyra-logo-white.png" alt="ANVYRA" width={90} height={28} className="h-7 w-auto" />
        <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="text-[#C4956A]">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="lg:hidden fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-[#1C0A04]">
            <NavContent />
          </aside>
        </>
      )}
    </>
  );
}
