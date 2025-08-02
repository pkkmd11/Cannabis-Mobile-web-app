import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useI18n, Language } from "@/lib/i18n";

const languages = [
  { code: "en" as Language, name: "English" },
  { code: "my" as Language, name: "မြန်မာဘာသာ" },
  { code: "th" as Language, name: "ภาษาไทย" },
];

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useI18n();

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
    localStorage.setItem("cannabistrack_language", lang);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <Globe className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-80 mx-4">
          <DialogHeader>
            <DialogTitle>
              Select Language / ဘာသာစကားရွေးချယ်ပါ / เลือกภาษา
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={language === lang.code ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleLanguageSelect(lang.code)}
              >
                {lang.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
