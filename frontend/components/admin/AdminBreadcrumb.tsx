import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb { label: string; href?: string; }

export default function AdminBreadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-[#A0673A] mb-6">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-[#C4956A]/50" />}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-[#5C2E1A] transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-[#5C2E1A] font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
