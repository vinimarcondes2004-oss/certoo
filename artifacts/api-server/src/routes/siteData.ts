import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { uploadBase64Media } from "./upload";

const router = Router();

const TABLE = "site_data";
const ROW_ID = "main";

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
    res.json(data.data);
  } catch (err) {
    console.error("GET /site-data error:", err);
    res.status(500).json({ error: "Failed to load site data" });
  }
});

router.put("/site-data", async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== "object") {
      res.status(400).json({ error: "Invalid data" });
      return;
    }

    const now = new Date().toISOString();

    const sizeKB = Math.round(JSON.stringify(payload).length / 1024);
    console.log(`[site-data] Recebido payload de ${sizeKB}KB — processando imagens...`);

    const processedPayload = await processBase64Media(payload);

    const sizeAfterKB = Math.round(JSON.stringify(processedPayload).length / 1024);
    console.log(`[site-data] Após upload de imagens: ${sizeAfterKB}KB — salvando no Supabase...`);

    const { data: existing, error: selectError } = await supabase
      .from(TABLE)
      .select("id")
      .eq("id", ROW_ID)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existing) {
      const { error: updateError } = await supabase
        .from(TABLE)
        .update({ data: processedPayload, updated_at: now })
        .eq("id", ROW_ID);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from(TABLE)
        .insert({ id: ROW_ID, data: processedPayload, updated_at: now });

      if (insertError) throw insertError;
    }

    broadcast();
    res.json({ ok: true });
  } catch (err) {
    console.error("PUT /site-data error:", err);
    res.status(500).json({ error: "Failed to save site data" });
  }
});

export default router;
