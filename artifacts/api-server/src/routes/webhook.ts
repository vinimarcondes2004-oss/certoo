import { Router, Request, Response } from "express";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabase } from "../lib/supabase";

const router = Router();
const TABLE = "site_data";
const ORDERS_ROW = "orders";

function getMpClient(): MercadoPagoConfig {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw new Error("MP_ACCESS_TOKEN não configurado.");
  return new MercadoPagoConfig({ accessToken: token });
}

async function getOrders(): Promise<any[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("data")
    .eq("id", ORDERS_ROW)
    .maybeSingle();
  if (error || !data) return [];
  return (data.data as { orders: any[] }).orders || [];
}

async function saveOrders(orders: any[]): Promise<void> {
  await supabase.from(TABLE).upsert({
    id: ORDERS_ROW,
    data: { orders },
    updated_at: new Date().toISOString(),
  });
}

router.post("/webhook/mercadopago", async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body as { type?: string; data?: { id?: string } };

    if (type !== "payment" || !data?.id) {
      return res.status(200).json({ received: true });
    }

    const paymentId = String(data.id);
    console.log(`[Webhook MP] Notificação recebida — payment_id: ${paymentId}`);

    const client = getMpClient();
    const paymentClient = new Payment(client);
    const payment = await paymentClient.get({ id: paymentId });

    const status = payment.status;
    const preferenceId = payment.preference_id;

    console.log(`[Webhook MP] payment_id=${paymentId} status=${status} preference_id=${preferenceId}`);

    if (status === "approved" && preferenceId) {
      const orders = await getOrders();
      const idx = orders.findIndex((o) => o.mpPreferenceId === preferenceId);

      if (idx === -1) {
        console.warn(`[Webhook MP] Nenhum pedido encontrado para preference_id=${preferenceId}`);
        return res.status(200).json({ received: true, warning: "Pedido não encontrado." });
      }

      if (orders[idx].status !== "pago") {
        orders[idx] = {
          ...orders[idx],
          status: "pago",
          mpPaymentId: paymentId,
          paidAt: new Date().toISOString(),
        };
        await saveOrders(orders);
        console.log(`[Webhook MP] Pedido ${orders[idx].id} confirmado como PAGO (payment_id=${paymentId})`);
      } else {
        console.log(`[Webhook MP] Pedido ${orders[idx].id} já estava PAGO, ignorando.`);
      }
    } else if (status === "cancelled" || status === "rejected") {
      if (preferenceId) {
        const orders = await getOrders();
        const idx = orders.findIndex((o) => o.mpPreferenceId === preferenceId);
        if (idx !== -1 && orders[idx].status === "pendente") {
          orders[idx] = { ...orders[idx], status: "cancelado", mpPaymentId: paymentId };
          await saveOrders(orders);
          console.log(`[Webhook MP] Pedido ${orders[idx].id} marcado como CANCELADO`);
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error("[Webhook MP] Erro:", err.message);
    res.status(200).json({ received: true, error: err.message });
  }
});

export default router;
