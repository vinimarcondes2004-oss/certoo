import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";

const router = Router();
const TABLE = "site_data";
const ORDERS_ROW = "orders";

interface OrderItem {
  id: string;
  name: string;
  price: string;
  qty: number;
}

interface Order {
  id: string;
  createdAt: string;
  status: "pendente" | "pago" | "cancelado";
  customer: {
    nome: string;
    email: string;
  };
  address: {
    cep: string;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  items: OrderItem[];
  subtotal: number;
  frete: {
    valor: number;
    regiao: string;
    prazo: string;
    descricao: string;
  };
  total: number;
  mpPreferenceId?: string;
}

async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("data")
    .eq("id", ORDERS_ROW)
    .maybeSingle();

  if (error || !data) return [];
  return (data.data as { orders: Order[] }).orders || [];
}

async function saveOrders(orders: Order[]): Promise<void> {
  await supabase.from(TABLE).upsert({
    id: ORDERS_ROW,
    data: { orders },
    updated_at: new Date().toISOString(),
  });
}

router.get("/orders", async (_req: Request, res: Response) => {
  try {
    const orders = await getOrders();
    const sorted = [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json({ orders: sorted });
  } catch (err) {
    console.error("[Orders] GET error:", err);
    res.status(500).json({ error: "Erro ao buscar pedidos." });
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

    console.log(`[Orders] Novo pedido criado: ${order.id} — ${order.customer.nome} — R$${order.total.toFixed(2)}`);
    res.status(201).json({ order });
  } catch (err) {
    console.error("[Orders] POST error:", err);
    res.status(500).json({ error: "Erro ao salvar pedido." });
  }
});

router.patch("/orders/:id", async (req: Request, res: Response) => {
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
  } catch (err) {
    console.error("[Orders] PATCH error:", err);
    res.status(500).json({ error: "Erro ao atualizar pedido." });
  }
});

export default router;
