import { useState } from "react";
import { Link, useParams } from "wouter";
import { ShoppingCart, Star, ChevronRight, Check, Truck, Shield, Zap, MessageCircle, MapPin, CreditCard, Loader2 } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { useCart } from "@/context/CartContext";
import { FavBtn } from "@/components/FavBtn";
import { SharedHeader } from "@/components/SharedHeader";
import { SharedFooter } from "@/components/SharedFooter";

/** Converte string de preço "R$49,90" para número 49.90 */
function parsePriceBRL(priceStr: string): number {
  const cleaned = priceStr.replace(/[R$\s]/g, "").replace(",", ".");
  const value = parseFloat(cleaned);
  return isNaN(value) ? 0 : value;
}

/** Formata número para moeda BRL */
function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const PINK = "#e8006f";
const DARK_RED = "#c0003d";

const imgSrc = (img: string) =>
  img.startsWith("data:") || img.startsWith("http")
    ? img
    : `${import.meta.env.BASE_URL}${img}`;

function Stars({ n = 5, size = 14 }: { n?: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} fill={i <= n ? "#f5a623" : "none"} stroke={i <= n ? "#f5a623" : "#ddd"} />
      ))}
    </span>
  );
}

export default function Produto() {
  const { data } = useSite();
  const { addItem } = useCart();
  const { id } = useParams<{ id: string }>();
  const product = data.products.find(p => p.id === id);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <SharedHeader />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-2xl font-black text-gray-800 mb-2">Produto não encontrado</p>
          <p className="text-gray-400 mb-6">O produto que você procura não está disponível.</p>
          <Link href="/produtos">
            <button style={{ background: PINK }} className="text-white font-bold rounded-full px-8 py-3 hover:opacity-90 transition">
              Ver todos os produtos
            </button>
          </Link>
        </div>
        <SharedFooter />
      </div>
    );
  }

  const allImgs = [product.img, ...(product.extraImgs || [])].filter(Boolean);
  const related = data.products.filter(p => p.id !== product.id && (
    p.category === product.category ||
    (p.extraCategories || []).some(c => (product.extraCategories || []).includes(c))
  )).slice(0, 5);

  const defaultBenefits = [
    "Fórmula profissional de alta qualidade",
    "Resultados visíveis desde a primeira aplicação",
    "Para todos os tipos de cabelo",
  ];
  const benefits = product.benefits?.length ? product.benefits : defaultBenefits;

  const description = product.description ||
    `${product.name} é um produto profissional desenvolvido para oferecer brilho, maciez e saúde para seus fios. Com fórmula exclusiva, proporciona resultado visível desde a primeira aplicação, ideal para uso diário ou tratamentos intensivos.`;

  const outOfStock = product.outOfStock === true;
  const waLink = `https://wa.me/${data.settings.whatsapp}?text=Olá! Tenho interesse no produto: ${product.name}${qty > 1 ? ` (quantidade: ${qty})` : ""}`;

  // --- Estado do cálculo de frete ---
  const [cep, setCep] = useState("");
  const [freteInfo, setFreteInfo] = useState<{ valorFrete: number; descricao: string } | null>(null);
  const [freteErro, setFreteErro] = useState("");
  const [freteLoading, setFreteLoading] = useState(false);

  // --- Estado do checkout Mercado Pago ---
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutErro, setCheckoutErro] = useState("");

  /** Formata o CEP enquanto o usuário digita (XXXXX-XXX) */
  function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
    const formatted = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    setCep(formatted);
    // Limpa resultados anteriores ao alterar o CEP
    setFreteInfo(null);
    setFreteErro("");
    setCheckoutErro("");
  }

  /** Chama o backend para calcular o frete com base no CEP informado */
  async function calcularFrete() {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      setFreteErro("Informe um CEP válido com 8 dígitos.");
      return;
    }

    setFreteLoading(true);
    setFreteErro("");
    setFreteInfo(null);

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/frete?cep=${digits}`);
      const json = await res.json();

      if (!res.ok) {
        setFreteErro(json.error || "Erro ao calcular frete.");
      } else {
        setFreteInfo({ valorFrete: json.valorFrete, descricao: json.descricao });
      }
    } catch {
      setFreteErro("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setFreteLoading(false);
    }
  }

  /** Cria a preferência no Mercado Pago e redireciona para o checkout */
  async function finalizarCompra() {
    if (!freteInfo) {
      setCheckoutErro("Calcule o frete antes de finalizar a compra.");
      return;
    }

    setCheckoutLoading(true);
    setCheckoutErro("");

    const precoProduto = parsePriceBRL(product.price) * qty;
    const precoFrete = freteInfo.valorFrete;

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Envia produto e frete como itens separados
          items: [
            {
              title: `${product.name}${qty > 1 ? ` (x${qty})` : ""}`,
              quantity: 1,
              unit_price: precoProduto,
            },
            {
              title: freteInfo.descricao,
              quantity: 1,
              unit_price: precoFrete,
            },
          ],
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.init_point) {
        setCheckoutErro(json.error || "Erro ao criar pagamento. Tente novamente.");
      } else {
        // Redireciona para o checkout do Mercado Pago
        window.location.href = json.init_point;
      }
    } catch {
      setCheckoutErro("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, img: product.img, color: product.color });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <div className="min-h-screen bg-white">
      <SharedHeader />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-1 text-xs text-gray-400 flex-wrap">
        <Link href="/" className="hover:text-pink-600 transition">Início</Link>
        <ChevronRight size={12} />
        <Link href="/produtos" className="hover:text-pink-600 transition">Produtos</Link>
        <ChevronRight size={12} />
        <span style={{ color: PINK }} className="font-semibold">{product.name}</span>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* Images */}
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ height: 400, background: `linear-gradient(145deg, ${product.color}18, ${product.color}35)` }}>
              <img
                src={imgSrc(allImgs[selectedImg] || product.img)}
                alt={product.name}
                className="max-h-[370px] w-auto object-contain"
              />
            </div>
            {allImgs.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {allImgs.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition flex-shrink-0 flex items-center justify-center ${selectedImg === i ? "border-pink-500" : "border-gray-200 hover:border-gray-300"}`}
                    style={{ background: `linear-gradient(145deg, ${product.color}18, ${product.color}35)` }}>
                    <img src={imgSrc(img)} alt="" className="max-h-full w-auto object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            {product.badge && (
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-full w-fit text-white" style={{ background: PINK }}>
                {product.badge}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-3">
              <Stars n={product.stars} size={16} />
              <span className="text-sm text-gray-500">{product.stars}.0 de avaliação</span>
            </div>
            {product.ml && <p className="text-sm text-gray-500">{product.ml}</p>}

            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-black" style={{ color: PINK }}>{product.price}</span>
              {product.old && <span className="text-base text-gray-400 line-through">{product.old}</span>}
            </div>

            <div className="flex flex-col gap-2 mt-1">
              {benefits.slice(0, 3).map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check size={15} className="flex-shrink-0" style={{ color: PINK }} />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {outOfStock && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                <span className="text-red-600 text-sm font-bold">Esgotado no momento</span>
              </div>
            )}

            {!outOfStock && (
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm font-semibold text-gray-700">Quantidade:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition font-bold text-lg">
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-gray-900">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition font-bold text-lg">
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 mt-1">
              {outOfStock ? (
                <>
                  <button disabled
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-black text-lg opacity-50 cursor-not-allowed"
                    style={{ background: "#aaa" }}>
                    <ShoppingCart size={20} />
                    Esgotado
                  </button>
                  <a href={waLink} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition border-2 hover:bg-pink-50"
                    style={{ borderColor: PINK, color: PINK }}>
                    <MessageCircle size={16} />
                    Avise-me quando disponível
                  </a>
                </>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-black text-lg transition hover:opacity-90 relative overflow-hidden"
                    style={{ background: addedToCart ? "#22c55e" : `linear-gradient(135deg, ${DARK_RED}, ${PINK})` }}>
                    {addedToCart ? (
                      <><Check size={20} /> Adicionado!</>
                    ) : (
                      <><ShoppingCart size={20} /> Adicionar ao carrinho</>
                    )}
                  </button>
                  <a href={waLink} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition border-2 hover:bg-pink-50"
                    style={{ borderColor: PINK, color: PINK }}>
                    <MessageCircle size={16} />
                    Comprar pelo WhatsApp
                  </a>
                </>
              )}
            </div>

            {/* ===== Seção de Cálculo de Frete + Checkout Mercado Pago ===== */}
            {!outOfStock && (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 flex flex-col gap-3 mt-1">

                {/* Título da seção */}
                <p className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <Truck size={16} style={{ color: PINK }} />
                  Calcular frete
                </p>

                {/* Input de CEP + botão */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Digite seu CEP"
                      value={cep}
                      onChange={handleCepChange}
                      onKeyDown={e => e.key === "Enter" && calcularFrete()}
                      maxLength={9}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition"
                    />
                  </div>
                  <button
                    onClick={calcularFrete}
                    disabled={freteLoading}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-bold transition hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
                    style={{ background: `linear-gradient(135deg, ${DARK_RED}, ${PINK})` }}>
                    {freteLoading
                      ? <Loader2 size={15} className="animate-spin" />
                      : <Truck size={15} />}
                    Calcular
                  </button>
                </div>

                {/* Erro no CEP */}
                {freteErro && (
                  <p className="text-red-500 text-xs font-medium">{freteErro}</p>
                )}

                {/* Resultado do frete */}
                {freteInfo && (
                  <div className="bg-white border border-green-200 rounded-xl px-4 py-3 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{freteInfo.descricao}</span>
                      <span className="text-sm font-black text-green-700">
                        {formatBRL(freteInfo.valorFrete)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-1.5 mt-0.5">
                      <span className="text-sm font-bold text-gray-700">Total estimado</span>
                      <span className="text-base font-black" style={{ color: PINK }}>
                        {formatBRL(parsePriceBRL(product.price) * qty + freteInfo.valorFrete)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Botão Finalizar compra no Mercado Pago */}
                <button
                  onClick={finalizarCompra}
                  disabled={!freteInfo || checkoutLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-black text-base transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: freteInfo ? "#009ee3" : "#a0aec0" }}>
                  {checkoutLoading
                    ? <><Loader2 size={18} className="animate-spin" /> Aguarde...</>
                    : <><CreditCard size={18} /> Finalizar compra no Mercado Pago</>}
                </button>

                {/* Erro no checkout */}
                {checkoutErro && (
                  <p className="text-red-500 text-xs font-medium text-center">{checkoutErro}</p>
                )}

                {!freteInfo && !freteErro && (
                  <p className="text-xs text-gray-400 text-center">
                    Calcule o frete para habilitar o pagamento
                  </p>
                )}
              </div>
            )}

            {product.seals && product.seals.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {product.seals.map((seal, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Check size={12} style={{ color: PINK }} />
                    {seal}
                  </span>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[
                  { icon: <Truck size={18} />, label: "Entrega rápida" },
                  { icon: <Shield size={18} />, label: "Compra segura" },
                  { icon: <Zap size={18} />, label: "Resultado garantido" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-3 px-2 text-center">
                    <span style={{ color: PINK }}>{item.icon}</span>
                    <span className="text-[11px] text-gray-600 font-semibold">{item.label}</span>
                  </div>
                ))}
              </div>
            )}

            {product.delivery && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mt-1">
                <Truck size={16} className="flex-shrink-0 text-green-600" />
                <span className="text-green-700 text-sm font-semibold">{product.delivery}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About product */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-5">Sobre o produto</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{description}</p>
              {benefits.length > 0 && (
                <div className="space-y-2">
                  <p className="font-bold text-sm text-gray-800 mb-2">Benefícios:</p>
                  {benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check size={15} className="mt-0.5 flex-shrink-0" style={{ color: PINK }} />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              )}
              {product.howToUse && (
                <div className="mt-6">
                  <p className="font-bold text-sm text-gray-800 mb-2">Como usar:</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{product.howToUse}</p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4">
              {product.ingredients && (
                <div className="rounded-2xl border border-gray-100 p-5 bg-gray-50">
                  <p className="font-bold text-sm text-gray-800 mb-2">Ingredientes</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{product.ingredients}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {data.reviews.length > 0 && (
        <section className="py-14" style={{ background: "#fdf0f6" }}>
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">Avaliações de Clientes</h2>
            <p className="text-center text-sm text-gray-500 mb-8">Veja o que quem usou está dizendo</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {data.reviews.map(r => (
                <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={imgSrc(r.img)} alt={r.name} className="w-10 h-10 rounded-full object-cover"
                      onError={e => (e.currentTarget.style.display = "none")} />
                    <div>
                      <p className="font-bold text-sm text-gray-800">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.date}</p>
                    </div>
                  </div>
                  <Stars n={r.stars} size={13} />
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">"{r.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-black text-gray-900 mb-7">Você vai amar</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {related.map(p => (
                <Link key={p.id} href={`/produto/${p.id}`}>
                  <div className="relative rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer">
                    <FavBtn productId={p.id} />
                    <div style={{ height: 160, background: `linear-gradient(145deg, ${p.color}18, ${p.color}35)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={imgSrc(p.img)} alt={p.name} style={{ height: 140, width: "auto", objectFit: "contain" }} />
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-xs text-gray-800 leading-tight mb-1">{p.name}</p>
                      <p className="text-xs text-gray-400 mb-1">{p.ml}</p>
                      <Stars n={p.stars} size={11} />
                      <p className="font-black text-sm mt-1" style={{ color: PINK }}>{p.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <SharedFooter />
    </div>
  );
}
