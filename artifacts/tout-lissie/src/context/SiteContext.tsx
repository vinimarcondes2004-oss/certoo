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
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Falha ao salvar");
}

interface SiteContextType {
  data: SiteData;
  updateData: (updates: Partial<SiteData>) => void;
  saveToServer: () => Promise<void>;
  synced: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";
  hasUnsaved: boolean;
}

const SiteContext = createContext<SiteContextType | null>(null);

const UNSAVED_KEY = "pr_has_unsaved";

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(loadSiteData);
  const [synced, setSynced] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasUnsaved, setHasUnsaved] = useState(() => localStorage.getItem(UNSAVED_KEY) === "1");
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestData = useRef<SiteData>(data);

  useEffect(() => {
    const pendingUnsaved = localStorage.getItem(UNSAVED_KEY) === "1";
    if (pendingUnsaved) {
      setSynced(true);
      return;
    }
    fetchSiteData().then(serverData => {
      const resolved = serverData ?? mergeWithDefaults({});
      setData(resolved);
      latestData.current = resolved;
      saveSiteData(resolved);
      setSynced(true);
    });
  }, []);

  function updateData(updates: Partial<SiteData>) {
    setData(prev => {
      const next = { ...prev, ...updates };
      saveSiteData(next);
      latestData.current = next;
      return next;
    });
    localStorage.setItem(UNSAVED_KEY, "1");
    setHasUnsaved(true);
  }

  async function saveToServer() {
    if (statusTimer.current) clearTimeout(statusTimer.current);
    setSaveStatus("saving");
    try {
      await pushSiteData(latestData.current);
      setSaveStatus("saved");
      localStorage.removeItem(UNSAVED_KEY);
      setHasUnsaved(false);
      statusTimer.current = setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
      statusTimer.current = setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }

  return (
    <SiteContext.Provider value={{ data, updateData, saveToServer, synced, saveStatus, hasUnsaved }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}
