import { Router } from "express";
import { supabase } from "../lib/supabase";
import type { Server as SocketIOServer } from "socket.io";

const router = Router();

const TABLE = "content";
const ROW_ID = 1;

export interface ContentData {
  id?: number;
  title: string;
  description: string;
  image: string;
  buttonText: string;
}

const DEFAULT_CONTENT: Omit<ContentData, "id"> = {
  title: "Bem-vindo ao nosso site!",
  description: "Esta é a descrição principal do site. Edite pelo painel admin.",
  image: "",
  buttonText: "Saiba Mais",
};

async function fetchContent(): Promise<ContentData> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", ROW_ID)
    .single();

  if (error || !data) {
    return { id: ROW_ID, ...DEFAULT_CONTENT };
  }
  return data as ContentData;
}

async function upsertContent(payload: Omit<ContentData, "id">): Promise<ContentData> {
  const { data, error } = await supabase
    .from(TABLE)
    .upsert({ id: ROW_ID, ...payload }, { onConflict: "id" })
    .select()
    .single();

  if (error) throw error;
  return data as ContentData;
}

function toFrontendFormat(row: ContentData) {
  return {
    titulo: row.title,
    descricao: row.description,
    imagem: row.image,
    botao: row.buttonText,
  };
}

export function createContentRouter(io: SocketIOServer) {
  router.get("/content", async (_req, res) => {
    try {
      const content = await fetchContent();
      res.json(toFrontendFormat(content));
    } catch (err) {
      console.error("GET /content error:", err);
      res.status(500).json({ error: "Erro ao carregar conteúdo" });
    }
  });

  router.post("/content", async (req, res) => {
    const session = (req as any).session;
    if (!session?.admin) {
      res.status(401).json({ error: "Não autorizado" });
      return;
    }
    try {
      const { titulo, descricao, imagem, botao } = req.body;

      const current = await fetchContent();

      const updated = await upsertContent({
        title: titulo ?? current.title,
        description: descricao ?? current.description,
        image: imagem ?? current.image,
        buttonText: botao ?? current.buttonText,
      });

      const frontend = toFrontendFormat(updated);
      io.emit("content-updated", frontend);
      res.json({ ok: true, content: frontend });
    } catch (err) {
      console.error("POST /content error:", err);
      res.status(500).json({ error: "Erro ao salvar conteúdo" });
    }
  });

  return router;
}
