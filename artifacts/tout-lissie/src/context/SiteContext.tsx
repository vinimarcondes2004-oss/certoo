// @refresh reset
import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { SiteData, loadSiteData, saveSiteData, mergeWithDefaults } from "@/lib/siteData";

const API_URL = "/api/site-data";
const EVENTS_URL = "/api/site-data/events";
const POLL_INTERVAL_MS = 30_000;
const FETCH_TIMEOUT_MS = 12_000;

function fetchWithTimeout(url: string, opts: RequestInit = {}): Promise<Response> {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(tid));
}

async function fetchSiteData(): Promise<SiteData | null> {
  try {
    const res = await fetchWithTimeout(API_URL);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json || typeof json !== "object") return null;
    return mergeWithDefaults(json as Partial<SiteData>);
  } catch {
    return null;
  }
}

async function pushSiteData(data: SiteData): Promise<void> {
  const token = sessionStorage.getItem("admin_token") || "";
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetchWithTimeout(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => res.statusText);
        throw new Error(`HTTP ${res.status}: ${msg}`);
      }
      return;
    } catch (err) {
      lastErr = err;
      if (attempt < 3) await new Promise(r => setTimeout(r, 600 * attempt));
    }
  }
  throw lastErr;
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
  const hasUnsavedRef = useRef(false);

  function applyServerData(serverData: SiteData) {
    if (hasUnsavedRef.current) return;
    const serverStr = JSON.stringify(serverData);
    const localStr = JSON.stringify(latestData.current);
    if (serverStr === localStr) return;
    setData(serverData);
    latestData.current = serverData;
    savedSnapshot.current = serverData;
    saveSiteData(serverData);
  }

  useEffect(() => {
    fetchSiteData().then(serverData => {
      if (serverData) {
        applyServerData(serverData);
        savedSnapshot.current = serverData;
      }
      setSynced(true);
    });
  }, []);

  useEffect(() => {
    let es: EventSource | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let retryCount = 0;

    function connect() {
      es = new EventSource(EVENTS_URL);

      es.addEventListener("connected", () => {
        retryCount = 0;
      });

      es.addEventListener("data-changed", () => {
        fetchSiteData().then(serverData => {
          if (serverData) applyServerData(serverData);
        });
      });

      es.onerror = () => {
        es?.close();
        retryCount++;
        const delay = Math.min(5000 * retryCount, 30_000);
        retryTimer = setTimeout(connect, delay);
      };
    }

    connect();

    const pollTimer = setInterval(() => {
      if (hasUnsavedRef.current) return;
      fetchSiteData().then(serverData => {
        if (serverData) applyServerData(serverData);
      });
    }, POLL_INTERVAL_MS);

    return () => {
      es?.close();
      if (retryTimer) clearTimeout(retryTimer);
      clearInterval(pollTimer);
    };
  }, []);

  const updateData = useCallback((updates: Partial<SiteData>) => {
    setData(prev => {
      const next = { ...prev, ...updates };
      saveSiteData(next);
      latestData.current = next;
      return next;
    });
    hasUnsavedRef.current = true;
    setHasUnsaved(true);
  }, []);

  const saveToServer = useCallback(async () => {
    if (statusTimer.current) clearTimeout(statusTimer.current);
    setSaveStatus("saving");
    try {
      await pushSiteData(latestData.current);
      savedSnapshot.current = latestData.current;
      setSaveStatus("saved");
      hasUnsavedRef.current = false;
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
    hasUnsavedRef.current = false;
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
