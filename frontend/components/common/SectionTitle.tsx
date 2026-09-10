import { cn } from "@/lib/utils";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center" | "right";
  light?: boolean;
}

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  className,
  align = "center",
  light = false,
}: SectionTitleProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  return (
    <div className={cn("space-y-3", alignClass, className)}>
      {eyebrow && (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.25em]",
            light ? "text-[#d4af37]" : "text-[#8a7a4a]"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight sm:text-4xl",
          light ? "text-white" : "text-zinc-950"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mx-auto max-w-xl text-base leading-relaxed",
            align === "center" && "mx-auto",
            light ? "text-zinc-400" : "text-zinc-500"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
