import { X, ShoppingCart, Trash2, Plus, Minus, MessageCircle, CreditCard, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSite } from "@/context/SiteContext";
import { useState } from "react";

const PINK = "#e8006f";

function parsePrice(price: string): number {
  const cleaned = price.replace(/[^\d,]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

function imgSrc(v: string) {
  if (!v) return "";
  return v.startsWith("data:") || v.startsWith("http") ? v : `${import.meta.env.BASE_URL}${v}`;
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalItems } = useCart();
  const { data } = useSite();
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [stripeError, setStripeError] = useState("");

  const total = items.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0);

  const waMessage = encodeURIComponent(
    "Olá! Gostaria de finalizar meu pedido:\n\n" +
    items.map(i => `• ${i.name} x${i.qty} — ${i.price}`).join("\n") +
    `\n\nTotal: R$ ${total.toFixed(2).replace(".", ",")}`
  );
  const waLink = `https://wa.me/${data.settings.whatsapp}?text=${waMessage}`;

  async function handleStripeCheckout() {
    setLoadingStripe(true);
    setStripeError("");
    try {
      const origin = window.location.origin;
      const base = import.meta.env.BASE_URL ?? "/";
      const res = await fetch(`/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({ name: i.name, price: i.price, qty: i.qty, img: imgSrc(i.img) })),
          successUrl: `${origin}${base}?pedido=sucesso`,
          cancelUrl: `${origin}${base}?pedido=cancelado`,
          stripeKey: data.settings.stripeKey || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao iniciar pagamento");
      if (json.url) window.location.href = json.url;
    } catch (err: any) {
      setStripeError(err.message || "Erro ao conectar com o Stripe");
    } finally {
      setLoadingStripe(false);
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={closeCart}
        />
      )}

      <div
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} style={{ color: PINK }} />
            <span className="font-black text-gray-900 text-lg">Carrinho</span>
            {totalItems > 0 && (
              <span className="text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{ background: PINK }}>
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="p-1.5 hover:bg-gray-100 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
              <ShoppingCart size={32} className="text-gray-300" />
            </div>
            <p className="font-bold text-gray-700 text-lg">Seu carrinho está vazio</p>
            <p className="text-gray-400 text-sm">Adicione produtos para continuar</p>
            <button
              onClick={closeCart}
              className="text-white font-bold rounded-full px-7 py-2.5 text-sm hover:opacity-90 transition mt-2"
              style={{ background: PINK }}
            >
              Continuar comprando
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 bg-gray-50 rounded-2xl p-3">
                  <div
                    className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ background: `linear-gradient(145deg, ${item.color}18, ${item.color}35)` }}
                  >
                    <img src={imgSrc(item.img)} alt={item.name} className="w-14 h-14 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-800 leading-tight mb-1 truncate">{item.name}</p>
                    <p className="font-black text-sm" style={{ color: PINK }}>{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        <Minus size={12} className="text-gray-600" />
                      </button>
                      <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        <Plus size={12} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="self-start p-1.5 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={15} className="text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            <div className="px-4 pb-5 pt-3 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm font-semibold">Total</span>
                <span className="font-black text-xl" style={{ color: PINK }}>
                  R$ {total.toFixed(2).replace(".", ",")}
                </span>
              </div>

              {stripeError && (
                <p className="text-red-500 text-xs text-center">{stripeError}</p>
              )}

              <button
                onClick={handleStripeCheckout}
                disabled={loadingStripe}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-black text-base hover:opacity-90 transition disabled:opacity-60"
                style={{ background: PINK }}
              >
                {loadingStripe
                  ? <Loader2 size={20} className="animate-spin" />
                  : <CreditCard size={20} />
                }
                {loadingStripe ? "Aguarde..." : "Pagar com Cartão"}
              </button>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition"
                style={{ background: `linear-gradient(135deg, #25D366, #128C7E)` }}
              >
                <MessageCircle size={18} />
                Finalizar pelo WhatsApp
              </a>

              <button
                onClick={closeCart}
                className="w-full py-3 rounded-2xl font-bold text-sm border-2 hover:bg-pink-50 transition"
                style={{ borderColor: PINK, color: PINK }}
              >
                Continuar comprando
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
