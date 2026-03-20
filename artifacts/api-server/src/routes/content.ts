import { Router } from "express";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import type { Server as SocketIOServer } from "socket.io";

const router = Router();

const DATA_FILE = path.resolve(process.cwd(), "data/content.json");

export function getContent() {
  const raw = readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

export function saveContent(data: object) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function createContentRouter(io: SocketIOServer) {
  router.get("/content", (_req, res) => {
    try {
      const content = getContent();
      res.json(content);
    } catch (err) {
      console.error("GET /content error:", err);
      res.status(500).json({ error: "Erro ao carregar conteúdo" });
    }
  });

  router.post("/content", (req, res) => {
    const session = (req as any).session;
    if (!session?.admin) {
      res.status(401).json({ error: "Não autorizado" });
      return;
    }
    try {
      const { titulo, descricao, imagem, botao } = req.body;
      if (!titulo && !descricao && !imagem && !botao) {
        res.status(400).json({ error: "Nenhum campo fornecido" });
        return;
      }
      const current = getContent();
      const updated = {
        ...current,
        ...(titulo && { titulo }),
        ...(descricao && { descricao }),
        ...(imagem && { imagem }),
        ...(botao && { botao }),
      };
      saveContent(updated);
      io.emit("content-updated", updated);
      res.json({ ok: true, content: updated });
    } catch (err) {
      console.error("POST /content error:", err);
      res.status(500).json({ error: "Erro ao salvar conteúdo" });
    }
  });

  return router;
}
