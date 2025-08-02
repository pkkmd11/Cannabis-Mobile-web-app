import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { AppSettings, InsertAppSettings } from "@shared/schema";

export default function Settings() {
  const { t, language, setLanguage } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<AppSettings>({
    queryKey: ["/api/settings"],
  });

  const [formData, setFormData] = useState<InsertAppSettings>({
    appName: settings?.appName || "CannabisTrack",
    logoUrl: settings?.logoUrl || "",
    theme: settings?.theme || "light",
    language: settings?.language || "en",
  });

  // Update form data when settings load
  useEffect(() => {
    if (settings) {
      setFormData({
        appName: settings.appName,
        logoUrl: settings.logoUrl || "",
        theme: settings.theme,
        language: settings.language,
      });
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: InsertAppSettings) => {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update settings");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: t("common.success"),
        description: "Settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(formData);
    
    // Update language in context if changed
    if (formData.language !== language) {
      setLanguage(formData.language);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setFormData(prev => ({ ...prev, logoUrl: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetLogo = () => {
    setFormData(prev => ({ ...prev, logoUrl: "" }));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-green-800 dark:text-green-400">
        {t("settings.title")}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="appName">{t("settings.app_name")}</Label>
              <Input
                id="appName"
                value={formData.appName}
                onChange={(e) => setFormData(prev => ({ ...prev, appName: e.target.value }))}
                placeholder="App Name"
              />
            </div>

            <div className="space-y-2">
              <Label>{t("settings.logo")}</Label>
              {formData.logoUrl && (
                <div className="mb-4">
                  <img 
                    src={formData.logoUrl} 
                    alt="App Logo" 
                    className="w-16 h-16 object-contain border rounded"
                  />
                </div>
              )}
              <div className="flex space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="flex-1"
                />
                {formData.logoUrl && (
                  <Button type="button" variant="outline" onClick={resetLogo}>
                    {t("settings.reset_logo")}
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">{t("settings.theme")}</Label>
              <Select 
                value={formData.theme} 
                onValueChange={(value: "light" | "dark") => 
                  setFormData(prev => ({ ...prev, theme: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t("settings.theme.light")}</SelectItem>
                  <SelectItem value="dark">{t("settings.theme.dark")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">{t("settings.language")}</Label>
              <Select 
                value={formData.language} 
                onValueChange={(value: "en" | "my" | "th") => 
                  setFormData(prev => ({ ...prev, language: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="my">မြန်မာ</SelectItem>
                  <SelectItem value="th">ไทย</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={updateSettingsMutation.isPending}
            >
              {updateSettingsMutation.isPending ? t("common.loading") : t("settings.save_settings")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}