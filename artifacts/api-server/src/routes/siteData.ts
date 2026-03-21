import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { uploadBase64Media } from "./upload";
import { requireAdmin } from "./admin";

const router = Router();

const TABLE = "site_data";
const ROW_ID = "main";

let cachedData: unknown = undefined;
let cacheReady = false;

async function warmCache() {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("data")
      .eq("id", ROW_ID)
      .single();
    if (!error && data) {
      cachedData = data.data;
    }
  } catch {}
  cacheReady = true;
}

warmCache();

async function processBase64Media(obj: unknown): Promise<unknown> {
  if (typeof obj === "string") {
    if (obj.startsWith("data:image/") || obj.startsWith("data:video/")) {
      try {
        const url = await uploadBase64Media(obj);
        const tipo = obj.startsWith("data:video/") ? "Vídeo" : "Imagem";
        console.log(`[Upload] ${tipo} enviado ao Storage: ${url}`);
        return url;
      } catch (err) {
        console.warn("[Upload] Falha ao enviar mídia, mantendo original:", err);
        return obj;
      }
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return Promise.all(obj.map(processBase64Media));
  }
  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    await Promise.all(
      Object.entries(obj as Record<string, unknown>).map(async ([k, v]) => {
        result[k] = await processBase64Media(v);
      })
    );
    return result;
  }
  return obj;
}

const clients = new Set<Response>();

function broadcast() {
  for (const res of clients) {
    try {
      res.write("event: data-changed\ndata: {}\n\n");
    } catch {
      clients.delete(res);
    }
  }
}

router.get("/site-data/events", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  res.write("event: connected\ndata: {}\n\n");
  clients.add(res);

  const keepAlive = setInterval(() => {
    try {
      res.write(": ping\n\n");
    } catch {
      clearInterval(keepAlive);
      clients.delete(res);
    }
  }, 25000);

  req.on("close", () => {
    clearInterval(keepAlive);
    clients.delete(res);
  });
});

router.get("/site-data", async (_req, res) => {
  if (cacheReady) {
    res.json(cachedData ?? null);
    return;
  }
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("data")
      .eq("id", ROW_ID)
      .single();

    if (error || !data) {
      res.json(null);
      return;
    }
    cachedData = data.data;
    cacheReady = true;
    res.json(data.data);
  } catch (err) {
    console.error("GET /site-data error:", err);
    res.status(500).json({ error: "Falha ao carregar dados" });
  }
});

router.put("/site-data", requireAdmin, async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== "object") {
      res.status(400).json({ error: "Dados inválidos" });
      return;
    }

    const sizeKB = Math.round(JSON.stringify(payload).length / 1024);
    console.log(`[site-data] Recebido payload de ${sizeKB}KB — processando imagens...`);

    const processedPayload = await processBase64Media(payload);

    const sizeAfterKB = Math.round(JSON.stringify(processedPayload).length / 1024);
    console.log(`[site-data] Após upload de imagens: ${sizeAfterKB}KB — salvando no Supabase...`);

    const { error } = await supabase
      .from(TABLE)
      .upsert(
        { id: ROW_ID, data: processedPayload, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );

    if (error) throw error;

    cachedData = processedPayload;
    cacheReady = true;

    broadcast();
    res.json({ ok: true });
  } catch (err) {
    console.error("PUT /site-data error:", err);
    res.status(500).json({ error: "Falha ao salvar dados" });
  }
});

router.get("/storage/files", async (_req, res) => {
  try {
    const { data, error } = await supabase.storage
      .from("site-images")
      .list("", { limit: 200, sortBy: { column: "created_at", order: "asc" } });

    if (error) throw error;

    const files = (data || []).map(f => {
      const { data: urlData } = supabase.storage.from("site-images").getPublicUrl(f.name);
      const ext = f.name.split(".").pop()?.toLowerCase() || "";
      const isVideo = ["mp4", "webm", "mov", "avi", "ogv"].includes(ext);
      return {
        name: f.name,
        url: urlData.publicUrl,
        type: isVideo ? "video" : "image",
        created_at: f.created_at,
        size: f.metadata?.size ?? 0,
      };
    });

    res.json(files);
  } catch (err) {
    console.error("GET /storage/files error:", err);
    res.status(500).json({ error: "Falha ao listar arquivos" });
  }
});

export default router;
