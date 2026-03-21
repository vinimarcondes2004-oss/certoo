import { Router, Request, Response } from "express";
import { requireAdmin } from "./admin";
import { getOrders, saveOrders, Order } from "../lib/db";

const router = Router();

router.get("/orders", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const orders = await getOrders();
    const sorted = [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json({ orders: sorted });
  } catch (err: any) {
    console.error("[Orders] GET error:", err.message);
    res.status(500).json({ error: "Erro ao buscar pedidos. Tente novamente." });
  }
});

router.post("/orders", async (req: Request, res: Response) => {
  try {
    const body = req.body as Omit<Order, "id" | "createdAt" | "status">;

    if (!body.customer?.email || !body.items?.length) {
      res.status(400).json({ error: "Dados do pedido incompletos." });
      return;
    }

    const order: Order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "pendente",
      ...body,
    };

    const existing = await getOrders();
    await saveOrders([...existing, order]);

    console.log(`[Orders] Novo pedido: ${order.id} — ${order.customer.nome} — R$${order.total.toFixed(2)}`);
    res.status(201).json({ order });
  } catch (err: any) {
    console.error("[Orders] POST error:", err.message);
    res.status(500).json({ error: "Erro ao salvar pedido. Tente novamente." });
  }
});

router.patch("/orders/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: Order["status"] };

    const orders = await getOrders();
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) {
      res.status(404).json({ error: "Pedido não encontrado." });
      return;
    }

    orders[idx] = { ...orders[idx], status };
    await saveOrders(orders);
    res.json({ order: orders[idx] });
  } catch (err: any) {
    console.error("[Orders] PATCH error:", err.message);
    res.status(500).json({ error: "Erro ao atualizar pedido. Tente novamente." });
  }
});

export default router;
