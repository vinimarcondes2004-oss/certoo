import { Router } from "express";
import { db, siteDataTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

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
    res.json({ ok: true });
  } catch (err) {
    console.error("PUT /site-data error:", err);
    res.status(500).json({ error: "Failed to save site data" });
  }
});

export default router;
