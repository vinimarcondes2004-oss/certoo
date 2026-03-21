import { X, ShoppingCart, Trash2, Plus, Minus, MessageCircle, Loader2, QrCode, Copy, Check, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSite } from "@/context/SiteContext";
import { useState } from "react";

const PINK = "#e8006f";
const PIX_GREEN = "#00b894";

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

  const [pixStep, setPixStep] = useState<"idle" | "form" | "loading" | "qr">("idle");
  const [pixEmail, setPixEmail] = useState("");
  const [pixQr, setPixQr] = useState<{ qr_code: string; qr_code_base64: string } | null>(null);
  const [pixError, setPixError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loadingCard, setLoadingCard] = useState(false);
  const [cardError, setCardError] = useState("");
  const [cardStep, setCardStep] = useState<"idle" | "form">("idle");
  const [cardName, setCardName] = useState("");
  const [cardEmail, setCardEmail] = useState("");
  const [cardZip, setCardZip] = useState("");
  const [cardStreet, setCardStreet] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const total = items.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0);

  const waMessage = encodeURIComponent(
    "Olá! Gostaria de finalizar meu pedido:\n\n" +
    items.map(i => `• ${i.name} x${i.qty} — ${i.price}`).join("\n") +
    `\n\nTotal: R$ ${total.toFixed(2).replace(".", ",")}`
  );
  const waLink = `https://wa.me/${data.settings.whatsapp}?text=${waMessage}`;

  async function pagarComCartao() {
    if (!cardEmail || !cardEmail.includes("@")) {
      setCardError("Insira um e-mail válido.");
      return;
    }
    setLoadingCard(true);
    setCardError("");
    try {
      const origin = window.location.origin;
      const base = import.meta.env.BASE_URL ?? "/";
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({
            title: i.name,
            quantity: i.qty,
            unit_price: parsePrice(i.price),
          })),
          payer: {
            name: cardName || undefined,
            email: cardEmail,
            ...(cardZip || cardStreet || cardNumber ? {
              address: {
                zip_code: cardZip || undefined,
                street_name: cardStreet || undefined,
                street_number: cardNumber ? parseInt(cardNumber) : undefined,
              }
            } : {}),
          },
          successUrl: `${origin}${base}?pagamento=aprovado`,
          failureUrl: `${origin}${base}?pagamento=erro`,
          pendingUrl: `${origin}${base}?pagamento=pendente`,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao criar pagamento");
      if (json.init_point) window.location.href = json.init_point;
    } catch (err: any) {
      setCardError(err.message || "Erro ao conectar com o Mercado Pago");
    } finally {
      setLoadingCard(false);
    }
  }

  function resetPix() {
    setPixStep("idle");
    setPixQr(null);
    setPixError("");
    setPixEmail("");
  }

  async function gerarPix() {
    if (!pixEmail || !pixEmail.includes("@")) {
      setPixError("Insira um e-mail válido.");
      return;
    }
    setPixStep("loading");
    setPixError("");
    try {
      const res = await fetch("/api/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          description: items.map(i => `${i.name} x${i.qty}`).join(", "),
          email: pixEmail,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao gerar PIX");
      setPixQr({ qr_code: json.qr_code, qr_code_base64: json.qr_code_base64 });
      setPixStep("qr");
    } catch (err: any) {
      setPixError(err.message || "Erro ao gerar PIX");
      setPixStep("form");
    }
  }

  function copiarCodigo() {
    if (!pixQr?.qr_code) return;
    navigator.clipboard.writeText(pixQr.qr_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        ) : pixStep === "qr" && pixQr ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: PIX_GREEN }}>
              <QrCode size={24} className="text-white" />
            </div>
            <p className="font-black text-gray-900 text-lg text-center">QR Code PIX gerado!</p>
            <p className="text-gray-400 text-sm text-center">Escaneie o código abaixo com o app do seu banco.</p>

            <div className="rounded-2xl border-2 border-gray-100 p-3 bg-white shadow-sm">
              <img
                src={`data:image/png;base64,${pixQr.qr_code_base64}`}
                alt="QR Code PIX"
                className="w-52 h-52 object-contain"
              />
            </div>

            <p className="text-xs text-gray-500 font-semibold">Total: <span className="font-black" style={{ color: PINK }}>R$ {total.toFixed(2).replace(".", ",")}</span></p>

            <button
              onClick={copiarCodigo}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm border-2 transition"
              style={{ borderColor: PIX_GREEN, color: PIX_GREEN }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Código copiado!" : "Copiar código Pix Copia e Cola"}
            </button>

            <button
              onClick={resetPix}
              className="text-gray-400 text-xs hover:text-gray-600 transition"
            >
              ← Voltar ao carrinho
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

              {pixStep === "form" && (
                <div className="rounded-2xl border-2 p-3 space-y-2" style={{ borderColor: PIX_GREEN }}>
                  <p className="text-xs font-bold text-gray-600">Seu e-mail para recibo:</p>
                  <input
                    type="email"
                    value={pixEmail}
                    onChange={e => setPixEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && gerarPix()}
                    placeholder="cliente@email.com"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400 transition"
                    autoFocus
                  />
                  {pixError && <p className="text-red-500 text-xs">{pixError}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={gerarPix}
                      className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-1.5"
                      style={{ background: PIX_GREEN }}
                    >
                      <QrCode size={15} /> Gerar QR Code
                    </button>
                    <button
                      onClick={resetPix}
                      className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              )}

              {pixStep === "loading" && (
                <div className="flex items-center justify-center gap-2 py-3 text-sm text-gray-500">
                  <Loader2 size={18} className="animate-spin" style={{ color: PIX_GREEN }} />
                  Gerando PIX...
                </div>
              )}

              {pixStep === "idle" && cardStep === "idle" && (
                <button
                  onClick={() => setCardStep("form")}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-black text-base hover:opacity-90 transition"
                  style={{ background: PINK }}
                >
                  <CreditCard size={20} />
                  Pagar
                </button>
              )}

              {cardStep === "form" && (
                <div className="rounded-2xl border-2 p-3 space-y-2" style={{ borderColor: PINK }}>
                  <p className="text-xs font-bold text-gray-600">Seus dados:</p>
                  <input
                    type="text"
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-pink-400 transition"
                    autoFocus
                  />
                  <input
                    type="email"
                    value={cardEmail}
                    onChange={e => setCardEmail(e.target.value)}
                    placeholder="E-mail"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-pink-400 transition"
                  />
                  <input
                    type="text"
                    value={cardZip}
                    onChange={e => setCardZip(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    placeholder="CEP (somente números)"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-pink-400 transition"
                  />
                  <input
                    type="text"
                    value={cardStreet}
                    onChange={e => setCardStreet(e.target.value)}
                    placeholder="Rua / Logradouro"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-pink-400 transition"
                  />
                  <input
                    type="number"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && pagarComCartao()}
                    placeholder="Número"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-pink-400 transition"
                  />
                  {cardError && <p className="text-red-500 text-xs">{cardError}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={pagarComCartao}
                      disabled={loadingCard}
                      className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-1.5 disabled:opacity-60"
                      style={{ background: PINK }}
                    >
                      {loadingCard ? <Loader2 size={15} className="animate-spin" /> : <CreditCard size={15} />}
                      {loadingCard ? "Aguarde..." : "Confirmar"}
                    </button>
                    <button
                      onClick={() => { setCardStep("idle"); setCardError(""); }}
                      className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              )}

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
