import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  sub?: string;
  accent?: "bronze" | "brown" | "green" | "amber" | "red";
}

const ACCENT = {
  bronze: "bg-[#C4956A]/15 text-[#C4956A]",
  brown:  "bg-[#5C2E1A]/15 text-[#5C2E1A]",
  green:  "bg-emerald-100 text-emerald-700",
  amber:  "bg-amber-100 text-amber-700",
  red:    "bg-red-100 text-red-700",
};

export default function StatCard({ title, value, icon: Icon, sub, accent = "bronze" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[#D6CCBF] bg-white p-5 flex items-start gap-4">
      <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl", ACCENT[accent])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-[#A0673A]">{title}</p>
        <p className="mt-0.5 text-2xl font-bold text-[#1C0A04]">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-[#A0673A]">{sub}</p>}
      </div>
    </div>
  );
}
