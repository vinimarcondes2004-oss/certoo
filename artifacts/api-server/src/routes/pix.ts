import { Router } from "express";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

const router = Router();

function getMpClient(requestToken?: string): MercadoPagoConfig {
  const token = process.env.MP_ACCESS_TOKEN || requestToken;
  if (!token) throw new Error("Access token do Mercado Pago não configurado. Insira seu MP_ACCESS_TOKEN nas variáveis de ambiente.");
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

    const result = await paymentClient.create({
      body: {
        transaction_amount: amount,
        description: description || "Compra",
        payment_method_id: "pix",
        payer: {
          email,
        },
      },
    });

    const txData = result.point_of_interaction?.transaction_data;

    res.json({
      id: result.id,
      status: result.status,
      qr_code: txData?.qr_code,
      qr_code_base64: txData?.qr_code_base64,
    });
  } catch (err: any) {
    console.error("Mercado Pago PIX error:", err.message);
    res.status(500).json({ error: err.message || "Erro ao gerar PIX" });
  }
});

router.post("/create-payment", async (req, res) => {
  try {
    const { items, successUrl, failureUrl, pendingUrl, payer, mpToken } = req.body as {
      items: { title: string; quantity: number; unit_price: number }[];
      successUrl?: string;
      failureUrl?: string;
      pendingUrl?: string;
      payer?: { name?: string; email?: string; address?: { zip_code?: string; street_name?: string; street_number?: number } };
      mpToken?: string;
    };

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Nenhum item informado" });
    }

    const client = getMpClient(mpToken);
    const preferenceClient = new Preference(client);

    const origin = req.headers.origin || req.headers.referer || "https://seusite.com";

    const result = await preferenceClient.create({
      body: {
        items,
        shipments: {
          mode: "not_specified",
        },
        ...(payer ? { payer } : {}),
        back_urls: {
          success: successUrl || `${origin}?pagamento=aprovado`,
          failure: failureUrl || `${origin}?pagamento=erro`,
          pending: pendingUrl || `${origin}?pagamento=pendente`,
        },
        auto_return: "approved",
      },
    });

    res.json({ init_point: result.init_point });
  } catch (err: any) {
    console.error("Mercado Pago Preference error:", err.message);
    res.status(500).json({ error: err.message || "Erro ao criar pagamento" });
  }
});

export default router;
