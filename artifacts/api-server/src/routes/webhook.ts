import { Router, Request, Response } from "express";
import { MercadoPagoConfig, Payment } from "mercadopago";
import crypto from "crypto";
import { getOrders, saveOrders } from "../lib/db";
import { withRetry, withTimeout } from "../lib/retry";

const router = Router();

function getMpClient(): MercadoPagoConfig {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw new Error("MP_ACCESS_TOKEN não configurado.");
  return new MercadoPagoConfig({ accessToken: token });
}

function verifyMpSignature(req: Request): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true;

  const xSignature = req.headers["x-signature"] as string | undefined;
  const xRequestId = req.headers["x-request-id"] as string | undefined;
  const paymentId = (req.query as any).id || req.body?.data?.id;

  if (!xSignature) {
    console.warn("[Webhook MP] x-signature ausente — assinatura não verificada.");
    return true;
  }

  const parts: Record<string, string> = {};
  xSignature.split(",").forEach(part => {
    const [k, v] = part.split("=");
    if (k && v) parts[k.trim()] = v.trim();
  });

  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  const manifest = [
    paymentId ? `id:${paymentId}` : null,
    xRequestId ? `request-id:${xRequestId}` : null,
    `ts:${ts}`,
  ]
    .filter(Boolean)
    .join(";");

  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  const receivedBuf = Buffer.from(v1, "utf8");

  if (expectedBuf.length !== receivedBuf.length) {
    console.error("[Webhook MP] Assinatura inválida (tamanho incorreto) — possível requisição forjada.");
    return false;
  }

  const valid = crypto.timingSafeEqual(expectedBuf, receivedBuf);
  if (!valid) {
    console.error("[Webhook MP] Assinatura inválida — possível requisição forjada.");
  }
  return valid;
}

router.post("/webhook/mercadopago", async (req: Request, res: Response) => {
  res.status(200).json({ received: true });

  try {
    if (!verifyMpSignature(req)) {
      console.error("[Webhook MP] Requisição rejeitada por assinatura inválida.");
      return;
    }

    const { type, data } = req.body as { type?: string; data?: { id?: string } };

    if (type !== "payment" || !data?.id) return;

    const paymentId = String(data.id);
    console.log(`[Webhook MP] Notificação recebida — payment_id: ${paymentId}`);

    const client = getMpClient();
    const paymentClient = new Payment(client);

    const payment = await withRetry(
      () => withTimeout(paymentClient.get({ id: paymentId }), 15000, "MP get payment"),
      { attempts: 3, delayMs: 600, label: "MP.get payment" }
    );

    const status = payment.status;
    const preferenceId = payment.preference_id;

    console.log(`[Webhook MP] payment_id=${paymentId} status=${status} preference_id=${preferenceId}`);

    if (status === "approved" && preferenceId) {
      const orders = await getOrders();
      const idx = orders.findIndex(o => o.mpPreferenceId === preferenceId);

      if (idx === -1) {
        console.warn(`[Webhook MP] Nenhum pedido para preference_id=${preferenceId}`);
        return;
      }

      if (orders[idx].status !== "pago") {
        orders[idx] = {
          ...orders[idx],
          status: "pago",
          mpPaymentId: paymentId,
          paidAt: new Date().toISOString(),
        };
        await saveOrders(orders);
        console.log(`[Webhook MP] ✅ Pedido ${orders[idx].id} confirmado como PAGO.`);
      } else {
        console.log(`[Webhook MP] Pedido ${orders[idx].id} já estava PAGO, ignorando.`);
      }
    } else if (status === "cancelled" || status === "rejected") {
      if (preferenceId) {
        const orders = await getOrders();
        const idx = orders.findIndex(o => o.mpPreferenceId === preferenceId);
        if (idx !== -1 && orders[idx].status === "pendente") {
          orders[idx] = { ...orders[idx], status: "cancelado", mpPaymentId: paymentId };
          await saveOrders(orders);
          console.log(`[Webhook MP] Pedido ${orders[idx].id} marcado como CANCELADO.`);
        }
      }
    }
  } catch (err: any) {
    console.error("[Webhook MP] Erro ao processar notificação:", err.message);
  }
});

export default router;
