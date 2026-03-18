import { useState } from "react";
import {
  ShoppingCart, Star, ChevronDown, ChevronUp, Search,
  Heart, User, Menu, X, Instagram, Facebook, MessageCircle, ChevronRight
} from "lucide-react";

const PINK = "#e8006f";
const PINK2 = "#f5007a";
const PINK_LIGHT = "#fce4f0";
const DARK_RED = "#c0003d";
const GRAY_BG = "#f8f8f8";

/* ─── helpers ─── */
function Stars({ n = 5, size = 12 }: { n?: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size}
          fill={i <= n ? "#f5a623" : "none"}
          stroke={i <= n ? "#f5a623" : "#ddd"} />
      ))}
    </span>
  );
}

function BuyBtn({ label = "Comprar", full }: { label?: string; full?: boolean }) {
  return (
    <button
      style={{ background: PINK }}
      className={`text-white text-xs font-bold rounded-full px-4 py-1.5 hover:opacity-90 transition whitespace-nowrap ${full ? "w-full py-2 text-sm" : ""}`}
    >
      {label}
    </button>
  );
}

/* Placeholder product bottle illustration */
function Bottle({ color = PINK, w = 48, h = 80 }: { color?: string; w?: number; h?: number }) {
  return (
    <div style={{ width: w, height: h, position: "relative", flexShrink: 0 }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: w * 0.45, height: h * 0.18,
        background: color, borderRadius: "4px 4px 0 0", opacity: 0.9,
      }} />
      <div style={{
        position: "absolute", top: h * 0.16, left: 0, right: 0, bottom: 0,
        background: `linear-gradient(160deg, ${color}cc, ${color})`,
        borderRadius: "8px 8px 12px 12px",
      }}>
        <div style={{
          position: "absolute", top: "20%", left: "15%", right: "15%", height: "40%",
          background: "rgba(255,255,255,0.18)", borderRadius: 4,
        }} />
        <div style={{
          position: "absolute", bottom: "12%", left: "10%", right: "10%", height: "18%",
          background: "rgba(255,255,255,0.12)", borderRadius: 3,
        }} />
      </div>
    </div>
  );
}

/* Product image card */
function ProductImg({ color = PINK, height = 140 }: { color?: string; height?: number }) {
  return (
    <div style={{
      height,
      background: `linear-gradient(145deg, ${color}18, ${color}35)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      <img
        src={`${import.meta.env.BASE_URL}product-megaliss.png`}
        alt="Produto"
        style={{ height: height * 0.92, width: "auto", objectFit: "contain" }}
      />
    </div>
  );
}

/* ─── TOP ANNOUNCEMENT BAR ─── */
function AnnouncementBar() {
  return (
    <div style={{ background: `linear-gradient(90deg, ${DARK_RED}, ${PINK2})` }}
      className="py-2 px-4 flex items-center justify-between gap-4 text-white text-xs">
      <div className="hidden md:flex items-center gap-6 font-medium">
        <span>Pegue instantaneamente</span>
        <span className="opacity-60">|</span>
        <span>Proteja os fios</span>
        <span className="opacity-60">|</span>
        <span>Resultados visíveis</span>
      </div>
      <div className="flex md:hidden items-center gap-2 font-medium flex-1">
        <span>Pegue instantaneamente • Proteja os fios</span>
      </div>
      <button style={{ background: "white", color: PINK }}
        className="font-black text-xs rounded-full px-4 py-1.5 hover:opacity-90 transition whitespace-nowrap flex-shrink-0">
        APROVEITE AGORA!
      </button>
    </div>
  );
}

/* ─── HEADER ─── */
function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          {/* Logo */}
          <div className="flex flex-col leading-[1.1]">
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black"
                style={{ background: PINK }}>T</div>
              <span className="font-black text-lg tracking-tight" style={{ color: "#1a1a1a" }}>Tout</span>
              <span className="font-light text-lg tracking-tight text-gray-500">Lissie</span>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
          {["Início","Produtos","Quem usa","Depoimentos","FAQ"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(" ","-")}`}
              className="hover:text-pink-600 transition">{item}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5 bg-gray-50">
            <Search size={14} className="text-gray-400" />
            <input className="bg-transparent text-sm outline-none w-32 text-gray-700"
              placeholder="Buscar produtos..." />
          </div>
          <button className="relative p-1.5">
            <ShoppingCart size={20} className="text-gray-700" />
            <span className="absolute -top-1 -right-1 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold"
              style={{ background: PINK }}>0</span>
          </button>
          <button className="p-1.5 hidden md:block"><User size={20} className="text-gray-700" /></button>
          <button className="p-1.5 hidden md:block"><Heart size={20} className="text-gray-700" /></button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-3 text-sm font-medium bg-white">
          {["Início","Produtos","Quem usa","Depoimentos","FAQ"].map(item => (
            <a key={item} href="#" className="py-1 text-gray-700">{item}</a>
          ))}
        </div>
      )}
    </header>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <>
      {/* Main hero */}
      <section className="relative overflow-hidden" style={{ minHeight: 420 }}>
        {/* Full-cover background image */}
        <img
          src={`${import.meta.env.BASE_URL}hero-bg.png`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Gradient overlay so text is readable on the left */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgba(180,0,60,0.82) 0%, rgba(220,0,80,0.65) 40%, rgba(0,0,0,0.05) 100%)" }} />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center">
          <div className="flex-1 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 opacity-90">
              SMASH, IMEDIATAMENTE
            </p>
            <h1 className="font-black text-4xl md:text-5xl leading-[1.1] mb-5">
              Perfeito para<br />todas as horas<br />do seu dia
            </h1>
            <a href="#produtos">
              <button className="bg-white font-black rounded-full px-7 py-2.5 text-sm hover:bg-pink-50 transition"
                style={{ color: PINK }}>
                APROVEITE AGORA!
              </button>
            </a>
          </div>
          {/* Spacer so text doesn't overlap face */}
          <div className="flex-1 hidden md:block" />
        </div>
      </section>

    </>
  );
}

/* ─── MAIS VENDIDOS ─── */
const bestSellers = [
  { name: "Progressiva sem formol", ml: "300ml", price: "R$ 49,90", old: "R$ 69,90", stars: 5, n: 234, color: PINK, badge: "Mais Vendido" },
  { name: "Condicionador Brilho", ml: "300ml", price: "R$ 44,90", old: "R$ 59,90", stars: 5, n: 189, color: "#4a90e2", badge: "Top" },
  { name: "Máscara Hidratação", ml: "250g", price: "R$ 59,90", old: "R$ 79,90", stars: 5, n: 312, color: "#ff6b6b", badge: "Favorito" },
  { name: "Óleo Reparador", ml: "50ml", price: "R$ 39,90", old: "R$ 54,90", stars: 4, n: 156, color: "#43a047", badge: "Novo" },
  { name: "Finalizador Liss", ml: "200ml", price: "R$ 54,90", old: "R$ 74,90", stars: 5, n: 278, color: "#8e24aa", badge: "Destaque" },
];

function BestSellers() {
  return (
    <section id="produtos" className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-gray-900">Mais Vendidos</h2>
          <a href="#" style={{ color: PINK }} className="text-sm font-semibold flex items-center gap-0.5 hover:underline">
            Ver todos <ChevronRight size={15} />
          </a>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
          {bestSellers.map((p, i) => (
            <div key={i} className="flex-shrink-0 w-44 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="relative">
                <span className="absolute top-2 left-2 z-10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: PINK }}>{p.badge}</span>
                <ProductImg color={p.color} height={130} />
              </div>
              <div className="p-3">
                <p className="font-bold text-xs text-gray-800 leading-tight mb-0.5">{p.name}</p>
                <p className="text-[11px] text-gray-400 mb-1">{p.ml}</p>
                <Stars n={p.stars} size={11} />
                <p className="text-[10px] text-gray-400 line-through mt-1">{p.old}</p>
                <p className="font-black text-sm mb-2" style={{ color: PINK }}>{p.price}</p>
                <BuyBtn />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── QUEM USA TOUT RECOMENDA (photo mosaic) ─── */
const mosaicPhotos = [
  { bg: "#fce4f0", emoji: "👩🏻‍🦱", big: true },
  { bg: "#e3f2fd", emoji: "👩🏽‍🦰", big: false },
  { bg: "#e8f5e9", emoji: "👩🏾‍🦳", big: false },
  { bg: "#fff3e0", emoji: "👩🏼‍🦲", big: true },
  { bg: "#f3e5f5", emoji: "👩🏻‍🦳", big: false },
  { bg: "#fce4f0", emoji: "👩🏿‍🦱", big: false },
  { bg: "#e0f7fa", emoji: "👩🏽‍🦲", big: false },
  { bg: "#fff8e1", emoji: "👩🏾‍🦰", big: false },
];

function WhoRecommends() {
  return (
    <section className="py-8" style={{ background: GRAY_BG }}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-black text-center text-gray-900 mb-6">Quem usa Tout recomenda</h2>
        {/* Mosaic grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2" style={{ gridAutoRows: "120px" }}>
          {mosaicPhotos.map((p, i) => (
            <div key={i}
              className={`rounded-2xl flex items-center justify-center overflow-hidden ${p.big ? "row-span-2 col-span-2" : "col-span-1"}`}
              style={{ background: p.bg, fontSize: p.big ? "5rem" : "2.5rem" }}>
              {p.emoji}
            </div>
          ))}
          {/* Extra filler cells for desktop */}
          <div className="hidden md:block rounded-2xl col-span-1" style={{ background: "#fce4f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="text-4xl">💕</span>
          </div>
          <div className="hidden md:block rounded-2xl" style={{ background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="text-4xl">✨</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── ELEGANCE BANNER ─── */
function EleganceBanner() {
  return (
    <section style={{ background: `linear-gradient(120deg, #1a0010 0%, #3d0020 40%, #6b0030 70%, #c0003d 100%)` }}
      className="py-14 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full" style={{ background: PINK, filter: "blur(80px)" }} />
      </div>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 relative z-10">
        <div className="flex-1">
          <p style={{ color: "#ff88bb" }} className="text-sm font-semibold uppercase tracking-widest mb-2">A elegância que</p>
          <h2 className="text-white font-black text-4xl md:text-5xl leading-tight mb-3">
            seus fios <span style={{ color: "#ff88bb" }}>merecem</span>
          </h2>
          <p className="text-white/60 text-sm mb-6">Cabelos lindos • Fios saudáveis • Resultado garantido</p>
          <button style={{ background: PINK }} className="text-white font-bold rounded-full px-7 py-2.5 text-sm hover:opacity-90 transition">
            Descubra Agora
          </button>
        </div>
        <div className="flex items-end gap-3 justify-center">
          {[
            { color: PINK, h: 160 },
            { color: "#ff4499", h: 190 },
            { color: "#c0003d", h: 140 },
          ].map((b, i) => (
            <Bottle key={i} color={b.color} w={55} h={b.h} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FINALIZADORES ─── */
const finalizadores = [
  { name: "Sérum Liss Pro", price: "R$ 64,90", stars: 5, n: 198, color: PINK },
  { name: "Spray Protetor Térmico", price: "R$ 38,90", stars: 5, n: 145, color: "#2196f3" },
  { name: "Creme Finalizador", price: "R$ 52,90", stars: 5, n: 221, color: "#ff6b6b" },
  { name: "Óleo de Argan", price: "R$ 45,90", stars: 4, n: 167, color: "#ff9800" },
  { name: "Leave-in Nutritivo", price: "R$ 41,90", stars: 5, n: 189, color: "#8e24aa" },
];

function Finalizadores() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-gray-900">Finalizadores</h2>
          <a href="#" style={{ color: PINK }} className="text-sm font-semibold flex items-center gap-0.5 hover:underline">
            Ver todos <ChevronRight size={15} />
          </a>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
          {finalizadores.map((p, i) => (
            <div key={i} className="flex-shrink-0 w-44 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
              <ProductImg color={p.color} height={130} />
              <div className="p-3">
                <p className="font-bold text-xs text-gray-800 leading-tight mb-1">{p.name}</p>
                <Stars n={p.stars} size={11} />
                <p className="font-black text-sm mt-1.5 mb-2" style={{ color: PINK }}>{p.price}</p>
                <BuyBtn />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── RESULTADO MAGIC ─── */
function ResultadoMagic() {
  return (
    <section className="py-10" style={{ background: GRAY_BG }}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-black text-center text-gray-900 mb-2">Resultado Magic</h2>
        <p className="text-center text-gray-500 text-sm mb-8">Veja a transformação real</p>
        {/* Large person photo + products */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Person photo placeholder */}
          <div className="relative flex-shrink-0">
            <div style={{
              width: 280, height: 380,
              background: "linear-gradient(180deg, #fce4f0 0%, #f8b4d4 50%, #e84393 100%)",
              borderRadius: 24,
              display: "flex", alignItems: "flex-end", justifyContent: "center",
              overflow: "hidden",
            }}>
              <span style={{ fontSize: "10rem", lineHeight: 1 }}>👩🏾‍🦱</span>
            </div>
          </div>
          {/* Products alongside */}
          <div className="flex md:flex-col gap-4 items-center">
            {[PINK, "#ff4499", "#c0003d"].map((c, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Bottle color={c} w={50} h={90} />
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700">Produto {i + 1}</p>
                  <p className="text-xs" style={{ color: PINK }}>R$ {(49.9 + i * 10).toFixed(2).replace(".", ",")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── QUEM USA TOUT RECOMENDA (reviews) ─── */
const reviews = [
  { name: "Fernanda K.", avatar: "👩🏻", stars: 5, text: "Incrível! Meu cabelo ficou liso, brilhoso e saudável desde a primeira aplicação.", date: "15 mar 2026" },
  { name: "Beatriz S.", avatar: "👩🏽", stars: 5, text: "A máscara é um milagre! Nunca vi resultado tão rápido e duradouro.", date: "12 mar 2026" },
  { name: "Priscila A.", avatar: "👩🏾", stars: 5, text: "O finalizador deixa o cabelo com um brilho incomparável. Recomendo!", date: "10 mar 2026" },
  { name: "Renata M.", avatar: "👩🏼", stars: 5, text: "Uso toda a linha e meu cabelo nunca esteve tão saudável.", date: "8 mar 2026" },
];

function WhoUses() {
  return (
    <section id="quem-usa" className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-black text-center text-gray-900 mb-6">Quem usa Tout recomenda! 💖</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {reviews.map((r, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xl"
                  style={{ background: PINK_LIGHT }}>{r.avatar}</div>
                <div>
                  <p className="font-bold text-xs text-gray-800">{r.name}</p>
                  <p className="text-[10px] text-gray-400">{r.date}</p>
                </div>
              </div>
              <Stars n={r.stars} size={12} />
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── DEPARTAMENTOS ─── */
const depts = [
  { name: "Shampoos", icon: "🧴" },
  { name: "Condicionadores", icon: "💧" },
  { name: "Máscaras", icon: "🌸" },
  { name: "Finalizadores", icon: "✨" },
  { name: "Óleos", icon: "💎" },
  { name: "Protetor", icon: "🛡️" },
  { name: "Kits", icon: "🎁" },
  { name: "Acessórios", icon: "💫" },
];

function Departments() {
  return (
    <section style={{ background: GRAY_BG }} className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
          Departamentos <span>💅</span>
        </h2>
        <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
          {depts.map(d => (
            <button key={d.name} className="flex flex-col items-center gap-2 flex-shrink-0 group">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl group-hover:scale-105 transition">
                {d.icon}
              </div>
              <span className="text-xs font-semibold text-gray-600 group-hover:text-pink-600 transition text-center whitespace-nowrap">
                {d.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TOUT LISSIE A QUERIDINHA DOS SALÕES ─── */
const salonReviews = [
  { name: "Ana C.", role: "Cabeleireira profissional", avatar: "👩🏻‍🦰", stars: 5, text: "Meus clientes amam os resultados! Uso Tout Lissie em todos os atendimentos." },
  { name: "Mariana T.", role: "Salão de Beleza SP", avatar: "👩🏽", stars: 5, text: "A linha é perfeita para cabelos difíceis. Resultados surpreendentes!" },
  { name: "Renata P.", role: "Hair Stylist", avatar: "👩🏾‍🦳", stars: 5, text: "Qualidade profissional a um preço acessível. Super recomendo!" },
  { name: "Luana B.", role: "Salão Chic RJ", avatar: "👩🏼‍🦱", stars: 5, text: "Desde que comecei a usar Tout, minhas clientes voltam sempre!" },
];

function SalonSection() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-black text-center text-gray-900 mb-2">
          Tout Lissie a queridinha dos salões <span style={{ color: PINK }}>♥</span>
        </h2>
        <p className="text-center text-sm text-gray-500 mb-7">Profissionais que confiam na qualidade Tout</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {salonReviews.map((r, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl"
                  style={{ background: PINK_LIGHT }}>{r.avatar}</div>
                <div>
                  <p className="font-bold text-xs text-gray-800">{r.name}</p>
                  <p className="text-[10px] text-gray-400">{r.role}</p>
                </div>
              </div>
              <Stars n={r.stars} size={12} />
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
const faqs = [
  { q: "Como usar o shampoo Tout Lissie?", a: "Aplique sobre os cabelos molhados, massageie o couro cabeludo por 2 a 3 minutos e enxágue bem. Para melhores resultados, use com o condicionador da linha." },
  { q: "Os produtos são para todos os tipos de cabelo?", a: "Sim! A linha foi desenvolvida para atender todos os tipos de cabelo — liso, ondulado, cacheado e crespo — com fórmulas específicas para cada necessidade." },
  { q: "Qual o prazo de entrega?", a: "O prazo varia conforme sua localização. Em geral entregamos em 2 a 7 dias úteis. Pedidos acima de R$150 têm frete grátis." },
  { q: "Posso trocar ou devolver?", a: "Sim! Oferecemos 30 dias para troca ou devolução sem complicação. Sua satisfação total ou o dinheiro de volta." },
  { q: "Os produtos são testados em animais?", a: "Não! Somos 100% cruelty-free. Todos os produtos são desenvolvidos sem testes em animais e com ingredientes de origem sustentável." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" style={{ background: GRAY_BG }} className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-black text-gray-900 mb-6">FAQ</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Accordion */}
          <div className="flex-1 space-y-2">
            {faqs.map((f, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100">
                <button
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}>
                  <span className="font-semibold text-sm text-gray-800">{f.q}</span>
                  {open === i
                    ? <ChevronUp size={16} style={{ color: PINK }} className="flex-shrink-0" />
                    : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                </button>
                {open === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right CTA card */}
          <div className="md:w-72 flex-shrink-0">
            <div style={{ background: `linear-gradient(135deg, ${PINK}, #ff6bb3)` }}
              className="rounded-2xl p-6 text-white h-full flex flex-col justify-between min-h-[280px]">
              <div>
                <h3 className="font-black text-xl mb-2">Ficou alguma dúvida?</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Nossa equipe está disponível para te ajudar segunda a sexta, das 8h às 18h.
                </p>
              </div>
              <div className="space-y-2 mt-6">
                <button className="w-full bg-white font-bold rounded-full py-2.5 text-sm hover:bg-pink-50 transition flex items-center justify-center gap-2"
                  style={{ color: PINK }}>
                  <MessageCircle size={16} /> Falar pelo WhatsApp
                </button>
                <button className="w-full border-2 border-white text-white font-bold rounded-full py-2.5 text-sm hover:bg-white/10 transition">
                  Enviar e-mail
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer style={{ background: PINK }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-black text-sm" style={{ color: PINK }}>T</div>
              <span className="font-black text-xl">Tout Lissie</span>
            </div>
            <p className="text-white/75 text-sm leading-relaxed mb-4">
              A marca favorita de quem cuida do cabelo com amor e dedicação.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, MessageCircle].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-white/60">Produtos</h4>
            <ul className="space-y-1.5 text-sm text-white/80">
              {["Shampoos","Condicionadores","Máscaras","Finalizadores","Óleos","Kits"].map(item => (
                <li key={item}><a href="#" className="hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-white/60">Empresa</h4>
            <ul className="space-y-1.5 text-sm text-white/80">
              {["Sobre nós","Blog","Parceiros","Trabalhe conosco"].map(item => (
                <li key={item}><a href="#" className="hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-white/60">Suporte</h4>
            <ul className="space-y-1.5 text-sm text-white/80">
              {["Central de ajuda","Trocas e devoluções","Rastrear pedido","Privacidade","Termos de uso"].map(item => (
                <li key={item}><a href="#" className="hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-xs">© 2026 Tout Lissie. Todos os direitos reservados.</p>
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-xs">Pagamentos:</span>
            {["Visa","Master","Pix","Boleto"].map(p => (
              <span key={p} className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded font-medium">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE ─── */
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <Hero />
      <BestSellers />
      <WhoRecommends />
      <EleganceBanner />
      <Finalizadores />
      <ResultadoMagic />
      <WhoUses />
      <Departments />
      <SalonSection />
      <FAQ />
      <Footer />
    </div>
  );
}
