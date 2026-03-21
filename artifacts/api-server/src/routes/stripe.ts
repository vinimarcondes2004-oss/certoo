import { Router } from "express";
import Stripe from "stripe";

const router = Router();

function getStripe(requestKey?: string): Stripe {
  const key = process.env.STRIPE_SECRET_KEY || requestKey;
  if (!key) throw new Error("Chave do Stripe não configurada. Acesse o painel Admin → Configurações e insira sua chave secreta do Stripe.");
  return new Stripe(key, { apiVersion: "2025-05-28.basil" });
}

function parsePriceCents(price: string): number {
  const cleaned = price.replace(/[^\d,]/g, "").replace(",", ".");
  const value = parseFloat(cleaned);
  if (isNaN(value) || value <= 0) throw new Error(`Invalid price: ${price}`);
  return Math.round(value * 100);
}

router.post("/checkout", async (req, res) => {
  try {
    const { items, successUrl, cancelUrl, stripeKey } = req.body as {
      items: { name: string; price: string; qty: number; img?: string }[];
      successUrl: string;
      cancelUrl: string;
      stripeKey?: string;
    };
    const stripe = getStripe(stripeKey);

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Carrinho vazio" });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(item => ({
      quantity: item.qty,
      price_data: {
        currency: "brl",
        unit_amount: parsePriceCents(item.price),
        product_data: {
          name: item.name,
          ...(item.img && item.img.startsWith("http") ? { images: [item.img] } : {}),
        },
      },
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err.message);
    res.status(500).json({ error: err.message || "Erro ao criar sessão de pagamento" });
  }
});

export default router;
