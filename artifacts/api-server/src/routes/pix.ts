import { Router } from "express";
import { MercadoPagoConfig, Payment } from "mercadopago";

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

export default router;
