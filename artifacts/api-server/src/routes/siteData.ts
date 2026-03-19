import { Router, Request, Response } from "express";
import { db, siteDataTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

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
    const rows = await db.select().from(siteDataTable).where(eq(siteDataTable.id, "main"));
    if (rows.length === 0) {
      res.json(null);
    } else {
      res.json(rows[0].data);
    }
  } catch (err) {
    console.error("GET /site-data error:", err);
    res.status(500).json({ error: "Failed to load site data" });
  }
});

router.put("/site-data", async (req, res) => {
  try {
    const data = req.body;
    if (!data || typeof data !== "object") {
      res.status(400).json({ error: "Invalid data" });
      return;
    }
    await db
      .insert(siteDataTable)
      .values({ id: "main", data })
      .onConflictDoUpdate({
        target: siteDataTable.id,
        set: { data, updatedAt: new Date() },
      });
    broadcast();
    res.json({ ok: true });
  } catch (err) {
    console.error("PUT /site-data error:", err);
    res.status(500).json({ error: "Failed to save site data" });
  }
});

export default router;
