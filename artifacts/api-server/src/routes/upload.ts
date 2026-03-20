import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

const BUCKET = "site-images";

function base64ToBuffer(dataUri: string): { buffer: Buffer; mimeType: string; ext: string } {
  const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid base64 data URI");
  const mimeType = match[1];
  const base64 = match[2];
  const buffer = Buffer.from(base64, "base64");
  const extMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  };
  const ext = extMap[mimeType] || "jpg";
  return { buffer, mimeType, ext };
}

export async function uploadBase64Image(dataUri: string): Promise<string> {
  const { buffer, mimeType, ext } = base64ToBuffer(dataUri);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}

router.post("/upload", async (req, res) => {
  try {
    const { dataUri } = req.body;
    if (!dataUri || !dataUri.startsWith("data:")) {
      res.status(400).json({ error: "dataUri inválido" });
      return;
    }
    const url = await uploadBase64Image(dataUri);
    res.json({ url });
  } catch (err) {
    console.error("POST /upload error:", err);
    res.status(500).json({ error: "Falha ao fazer upload da imagem" });
  }
});

export default router;
