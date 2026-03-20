import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

const TABLE = "site_data";
const ROW_ID = "main";

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

    const { error } = await supabase
      .from(TABLE)
      .upsert(
        { id: ROW_ID, data: payload, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );

    if (error) throw error;

    broadcast();
    res.json({ ok: true });
  } catch (err) {
    console.error("PUT /site-data error:", err);
    res.status(500).json({ error: "Failed to save site data" });
  }
});

export default router;
