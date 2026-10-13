import { cn } from "@/lib/utils";
import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  secondaryAction?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const ActionBtn = ({ act }: { act: { label: string; href?: string; onClick?: () => void } }) =>
    act.href ? (
      <Link href={act.href} className="btn-primary text-sm">
        {act.label}
      </Link>
    ) : (
      <button onClick={act.onClick} className="btn-primary text-sm">
        {act.label}
      </button>
    );

  const SecondaryBtn = ({ act }: { act: { label: string; href?: string; onClick?: () => void } }) =>
    act.href ? (
      <Link href={act.href} className="btn-outline text-sm">
        {act.label}
      </Link>
    ) : (
      <button onClick={act.onClick} className="btn-outline text-sm">
        {act.label}
      </button>
    );

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-20 text-center",
      className
    )}>
      {icon && (
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#EDE8E0] text-[#C4956A] shadow-inner">
          {icon}
        </div>
      )}

      <h3 className="heading-card text-[#1C0A04]">{title}</h3>

      {description && (
        <p className="mt-2 max-w-xs font-sans text-sm leading-relaxed text-[#A0673A]">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {action && <ActionBtn act={action} />}
          {secondaryAction && <SecondaryBtn act={secondaryAction} />}
        </div>
      )}
    </div>
  );
}
