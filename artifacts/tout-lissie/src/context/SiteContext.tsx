import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { SiteData, loadSiteData, saveSiteData, mergeWithDefaults } from "@/lib/siteData";

const API_URL = "/api/site-data";
const AUTO_SAVE_DELAY = 1500;

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
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestData = useRef<SiteData>(data);

  useEffect(() => {
    fetchSiteData().then(async serverData => {
      if (serverData) {
        setData(serverData);
        latestData.current = serverData;
        saveSiteData(serverData);
      } else {
        try {
          await pushSiteData(latestData.current);
        } catch {}
      }
      setSynced(true);
    });
  }, []);

  function triggerAutoSave() {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      if (statusTimer.current) clearTimeout(statusTimer.current);
      setSaveStatus("saving");
      try {
        await pushSiteData(latestData.current);
        setSaveStatus("saved");
        setHasUnsaved(false);
        statusTimer.current = setTimeout(() => setSaveStatus("idle"), 2500);
      } catch {
        setSaveStatus("error");
        statusTimer.current = setTimeout(() => setSaveStatus("idle"), 3000);
      }
    }, AUTO_SAVE_DELAY);
  }

  function updateData(updates: Partial<SiteData>) {
    setData(prev => {
      const next = { ...prev, ...updates };
      saveSiteData(next);
      latestData.current = next;
      return next;
    });
    setHasUnsaved(true);
    triggerAutoSave();
  }

  async function saveToServer() {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    if (statusTimer.current) clearTimeout(statusTimer.current);
    setSaveStatus("saving");
    try {
      await pushSiteData(latestData.current);
      setSaveStatus("saved");
      setHasUnsaved(false);
      statusTimer.current = setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
      statusTimer.current = setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }

  async function reloadFromServer() {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    if (statusTimer.current) clearTimeout(statusTimer.current);
    setSaveStatus("saving");
    const serverData = await fetchSiteData();
    if (!serverData) {
      setSaveStatus("no-server-data");
      statusTimer.current = setTimeout(() => setSaveStatus("idle"), 3000);
      return;
    }
    setData(serverData);
    latestData.current = serverData;
    saveSiteData(serverData);
    setHasUnsaved(false);
    setSaveStatus("saved");
    statusTimer.current = setTimeout(() => setSaveStatus("idle"), 2500);
  }

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
