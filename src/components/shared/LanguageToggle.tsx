import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = { className?: string };

export function LanguageToggle({ className }: Props) {
  const { language, toggleLanguage } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={cn(
        "h-8 px-2.5 text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground",
        className
      )}
      aria-label="Toggle language"
      title={language === "en" ? "Switch to Bangla" : "Switch to English"}
    >
      <span className="text-sm leading-none">{language === "en" ? "বাং" : "EN"}</span>
    </Button>
  );
}
