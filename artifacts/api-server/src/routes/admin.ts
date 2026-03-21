import { Router, Request, Response } from "express";
import crypto from "crypto";

const router = Router();

const ADMIN_USER = process.env["ADMIN_USER"] || "admin";
const ADMIN_PASS = process.env["ADMIN_PASS"] || "admin123";

const validTokens = new Set<string>();

export function requireAdmin(req: Request, res: Response, next: () => void) {
  const auth = req.headers["authorization"] || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  if (!token || !validTokens.has(token)) {
    res.status(401).json({ error: "Não autorizado" });
    return;
  }
  next();
}

router.post("/admin/login", (req: Request, res: Response) => {
  const { usuario, senha } = req.body;
  if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
    const token = crypto.randomBytes(32).toString("hex");
    validTokens.add(token);
    res.json({ ok: true, token });
  } else {
    res.status(401).json({ error: "Credenciais inválidas" });
  }
});

router.post("/admin/logout", (req: Request, res: Response) => {
  const auth = req.headers["authorization"] || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  if (token) validTokens.delete(token);
  res.json({ ok: true });
});

router.get("/admin/check", (req: Request, res: Response) => {
  const auth = req.headers["authorization"] || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  res.json({ loggedIn: token ? validTokens.has(token) : false });
});

export default router;
