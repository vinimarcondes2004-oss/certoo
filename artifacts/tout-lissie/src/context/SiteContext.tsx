import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { SiteData, loadSiteData, saveSiteData, mergeWithDefaults } from "@/lib/siteData";

const API_URL = "/api/site-data";

async function fetchSiteData(): Promise<SiteData | null> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json || typeof json !== "object") return null;
    return mergeWithDefaults(json as Partial<SiteData>);
  } catch {
    return null;
  }
}

async function pushSiteData(data: SiteData): Promise<void> {
  await fetch(API_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

interface SiteContextType {
  data: SiteData;
  updateData: (updates: Partial<SiteData>) => void;
  synced: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";
}

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(loadSiteData);
  const [synced, setSynced] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchSiteData().then(serverData => {
      if (serverData) {
        setData(serverData);
        saveSiteData(serverData);
      }
      setSynced(true);
    });
  }, []);

  function updateData(updates: Partial<SiteData>) {
    setData(prev => {
      const next = { ...prev, ...updates };
      saveSiteData(next);

      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (statusTimer.current) clearTimeout(statusTimer.current);

      setSaveStatus("saving");
      saveTimer.current = setTimeout(() => {
        pushSiteData(next)
          .then(() => {
            setSaveStatus("saved");
            statusTimer.current = setTimeout(() => setSaveStatus("idle"), 2500);
          })
          .catch(() => {
            setSaveStatus("error");
            statusTimer.current = setTimeout(() => setSaveStatus("idle"), 3000);
          });
      }, 300);

      return next;
    });
  }

  return (
    <SiteContext.Provider value={{ data, updateData, synced, saveStatus }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}
