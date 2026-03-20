import { Router, Request, Response } from "express";

const router = Router();

const ADMIN_USER = process.env["ADMIN_USER"] || "admin";
const ADMIN_PASS = process.env["ADMIN_PASS"] || "admin123";

export function requireAdmin(req: Request, res: Response, next: () => void) {
  const session = (req as any).session;
  if (!session?.admin) {
    res.status(401).json({ error: "Não autorizado" });
    return;
  }
  next();
}

router.post("/admin/login", (req: Request, res: Response) => {
  const { usuario, senha } = req.body;
  if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
    (req as any).session.admin = true;
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: "Credenciais inválidas" });
  }
});

router.post("/admin/logout", (req: Request, res: Response) => {
  (req as any).session.destroy();
  res.json({ ok: true });
});

router.get("/admin/check", (req: Request, res: Response) => {
  const session = (req as any).session;
  res.json({ loggedIn: !!session?.admin });
});

export default router;
