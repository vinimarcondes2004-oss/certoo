import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SiteData, loadSiteData, saveSiteData } from "@/lib/siteData";

interface SiteContextType {
  data: SiteData;
  updateData: (updates: Partial<SiteData>) => void;
}

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(loadSiteData);

  function updateData(updates: Partial<SiteData>) {
    setData(prev => {
      const next = { ...prev, ...updates };
      saveSiteData(next);
      return next;
    });
  }

  return (
    <SiteContext.Provider value={{ data, updateData }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}
