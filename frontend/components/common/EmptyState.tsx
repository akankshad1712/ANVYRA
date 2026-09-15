import { cn } from "@/lib/utils";
import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 text-center", className)}>
      {icon && (
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#EDE8E0] text-[#A0673A]">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-[#3D1A0A]">{title}</h3>
      {description && <p className="mt-2 text-sm text-[#A0673A] max-w-xs">{description}</p>}
      {action && (
        <div className="mt-6">
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center rounded-full bg-[#5C2E1A] px-6 py-3 text-sm font-semibold text-[#F7F3EE] transition hover:bg-[#3D1A0A]"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center rounded-full bg-[#5C2E1A] px-6 py-3 text-sm font-semibold text-[#F7F3EE] transition hover:bg-[#3D1A0A]"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
