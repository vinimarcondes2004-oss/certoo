import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";
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
  reloadFromServer: () => Promise<void>;
  synced: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error" | "no-server-data";
  hasUnsaved: boolean;
}

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(loadSiteData);
  const [synced, setSynced] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error" | "no-server-data">("idle");
  const [hasUnsaved, setHasUnsaved] = useState(false);

  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestData = useRef<SiteData>(data);
  const savedSnapshot = useRef<SiteData | null>(null);

  useEffect(() => {
    fetchSiteData().then(async serverData => {
      if (serverData) {
        setData(serverData);
        latestData.current = serverData;
        savedSnapshot.current = serverData;
        saveSiteData(serverData);
      } else {
        try {
          await pushSiteData(latestData.current);
          savedSnapshot.current = latestData.current;
        } catch {}
      }
      setSynced(true);
    });
  }, []);

  const updateData = useCallback((updates: Partial<SiteData>) => {
    setData(prev => {
      const next = { ...prev, ...updates };
      saveSiteData(next);
      latestData.current = next;
      return next;
    });
    setHasUnsaved(true);
  }, []);

  const saveToServer = useCallback(async () => {
    if (statusTimer.current) clearTimeout(statusTimer.current);
    setSaveStatus("saving");
    try {
      await pushSiteData(latestData.current);
      savedSnapshot.current = latestData.current;
      setSaveStatus("saved");
      setHasUnsaved(false);
      statusTimer.current = setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
      statusTimer.current = setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }, []);

  const reloadFromServer = useCallback(async () => {
    if (statusTimer.current) clearTimeout(statusTimer.current);

    const snapshot = savedSnapshot.current;
    if (!snapshot) {
      setSaveStatus("no-server-data");
      statusTimer.current = setTimeout(() => setSaveStatus("idle"), 3000);
      return;
    }

    setData(snapshot);
    latestData.current = snapshot;
    saveSiteData(snapshot);
    setHasUnsaved(false);
    setSaveStatus("saved");
    statusTimer.current = setTimeout(() => setSaveStatus("idle"), 2500);
  }, []);

  return (
    <SiteContext.Provider value={{ data, updateData, saveToServer, reloadFromServer, synced, saveStatus, hasUnsaved }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}
