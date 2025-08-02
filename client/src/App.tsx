import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { LanguageSelector } from "@/components/ui/language-selector";
import { I18nContext, Language, getTranslation } from "@/lib/i18n";
import { indexedDBService } from "@/lib/indexeddb";
import { Leaf, User } from "lucide-react";
import { Button } from "@/components/ui/button";

// Pages
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Sales from "@/pages/sales";
import Reports from "@/pages/reports";
import Audits from "@/pages/audits";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/sales" component={Sales} />
      <Route path="/reports" component={Reports} />
      <Route path="/audits" component={Audits} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize IndexedDB and language
    const init = async () => {
      try {
        await indexedDBService.init();
        const savedLang = localStorage.getItem("cannabistrack_language") as Language;
        if (savedLang && ["en", "my", "th"].includes(savedLang)) {
          setLanguage(savedLang);
        }
      } catch (error) {
        console.error("Failed to initialize app:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    init();
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("cannabistrack_language", newLanguage);
  };

  const t = (key: string) => getTranslation(language, key);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-cannabis-primary mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading CannabisTrack...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <I18nContext.Provider value={{ language, setLanguage: handleLanguageChange, t }}>
        <TooltipProvider>
          <div className="max-w-md mx-auto bg-white min-h-screen relative">
            {/* Header */}
            <header className="bg-cannabis-primary text-white p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Leaf className="text-2xl" />
                  <div>
                    <h1 className="text-lg font-semibold">{t("app.title")}</h1>
                    <p className="text-sm opacity-90">{t("app.subtitle")}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <LanguageSelector className="text-white hover:bg-cannabis-dark" />
                  <Button variant="ghost" size="sm" className="text-white hover:bg-cannabis-dark">
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </header>

            {/* Content Area */}
            <main className="pb-20">
              <Router />
            </main>

            {/* Bottom Navigation */}
            <BottomNavigation />
          </div>
          <Toaster />
        </TooltipProvider>
      </I18nContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
