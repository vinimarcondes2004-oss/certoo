import { Router } from "express";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import crypto from "crypto";
import { withRetry, withTimeout } from "../lib/retry";

const router = Router();

const MP_TIMEOUT_MS = 20000;

function getMpClient(requestToken?: string): MercadoPagoConfig {
  const token = process.env.MP_ACCESS_TOKEN || requestToken;
  if (!token) {
    throw new Error(
      "Token do Mercado Pago não configurado. Insira MP_ACCESS_TOKEN nas variáveis de ambiente."
    );
  }
  return new MercadoPagoConfig({ accessToken: token });
}

router.post("/pix", async (req, res) => {
  try {
    const { amount, description, email, mpToken } = req.body as {
      amount: number;
      description: string;
      email: string;
      mpToken?: string;
    };

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valor inválido" });
    }
    if (!email) {
      return res.status(400).json({ error: "E-mail do pagador é obrigatório" });
    }

    const client = getMpClient(mpToken);
    const paymentClient = new Payment(client);

    const result = await withRetry(
      () =>
        withTimeout(
          paymentClient.create({
            body: {
              transaction_amount: amount,
              description: description || "Compra",
              payment_method_id: "pix",
              payer: { email },
            },
          }),
          MP_TIMEOUT_MS,
          "MP criar PIX"
        ),
      { attempts: 2, delayMs: 800, label: "MP criar PIX" }
    );

    const txData = result.point_of_interaction?.transaction_data;

    return res.json({
      id: result.id,
      status: result.status,
      qr_code: txData?.qr_code,
      qr_code_base64: txData?.qr_code_base64,
    });
  } catch (err: any) {
    console.error("[MP] PIX error:", err.message);
    return res.status(500).json({ error: "Erro ao gerar PIX. Tente novamente." });
  }
});

router.post("/create-payment", async (req, res) => {
  try {
    const { items, successUrl, failureUrl, pendingUrl, payer, mpToken } = req.body as {
      items: { title: string; quantity: number; unit_price: number }[];
      successUrl?: string;
      failureUrl?: string;
      pendingUrl?: string;
      payer?: {
        name?: string;
        email?: string;
        address?: { zip_code?: string; street_name?: string; street_number?: string };
      };
      mpToken?: string;
    };

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Nenhum item informado" });
    }

    const client = getMpClient(mpToken);
    const preferenceClient = new Preference(client);

    const replitDomain = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_DOMAINS?.split(",")[0];
    const siteUrl = replitDomain ? `https://${replitDomain}` : (req.headers.origin || req.headers.referer || "https://prprofissional.com.br");
    const origin = req.headers.origin || req.headers.referer || siteUrl;

    const notificationUrl =
      process.env.MP_WEBHOOK_URL ||
      (replitDomain ? `https://${replitDomain}/api/webhook/mercadopago` : undefined);

    const idempotencyKey = crypto.randomUUID();

    const result = await withRetry(
      () =>
        withTimeout(
          preferenceClient.create({
            body: {
              items: items.map((item, i) => ({ id: String(i + 1), ...item })),
              shipments: { mode: "not_specified" },
              ...(payer ? { payer } : {}),
              back_urls: {
                success: successUrl || `${origin}?pagamento=aprovado`,
                failure: failureUrl || `${origin}?pagamento=erro`,
                pending: pendingUrl || `${origin}?pagamento=pendente`,
              },
              auto_return: "approved",
              ...(notificationUrl ? { notification_url: notificationUrl } : {}),
            },
            requestOptions: { idempotencyKey },
          }),
          MP_TIMEOUT_MS,
          "MP criar preferência"
        ),
      { attempts: 2, delayMs: 1000, label: "MP criar preferência" }
    );

    if (!result.init_point) {
      throw new Error("Mercado Pago não retornou o link de pagamento.");
    }

    console.log(`[MP] Preferência criada: ${result.id} | idempotency: ${idempotencyKey}`);
    return res.json({ init_point: result.init_point, preference_id: result.id });
  } catch (err: any) {
    console.error("[MP] create-payment error:", err.message);
    return res.status(500).json({ error: "Erro ao criar pagamento. Tente novamente." });
  }
});

export default router;
