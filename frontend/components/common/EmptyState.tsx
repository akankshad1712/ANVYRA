import { cn } from "@/lib/utils";
import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-zinc-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-zinc-500 max-w-xs">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
