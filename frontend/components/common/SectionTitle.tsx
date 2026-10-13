import { cn } from "@/lib/utils";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center" | "right";
  light?: boolean;
  serif?: boolean; // use Playfair Display for the title
}

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  className,
  align = "center",
  light = false,
  serif = false,
}: SectionTitleProps) {
  const alignClass = {
    left:   "text-left items-start",
    center: "text-center items-center",
    right:  "text-right items-end",
  }[align];

  return (
    <div className={cn("flex flex-col gap-3", alignClass, className)}>
      {eyebrow && (
        <p className={cn(
          "eyebrow",
          light ? "text-[#C4956A]" : "text-[#A0673A]"
        )}>
          {eyebrow}
        </p>
      )}

      <h2 className={cn(
        "tracking-tight",
        serif
          ? "font-serif text-4xl font-bold leading-tight sm:text-5xl"
          : "heading-section",
        light ? "text-[#F7F3EE]" : "text-[#1C0A04]"
      )}>
        {title}
      </h2>

      {/* Gold accent line */}
      <div className={cn(
        "h-0.5 w-10 rounded-full bg-gradient-to-r from-transparent via-[#C4956A] to-transparent",
        align === "center" && "mx-auto",
        align === "right"  && "ml-auto"
      )} />

      {subtitle && (
        <p className={cn(
          "font-sans text-base leading-relaxed",
          align === "center" && "mx-auto max-w-xl",
          align === "right"  && "ml-auto",
          light ? "text-[#C4956A]/80" : "text-[#A0673A]"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
