import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
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
          <div className="flex items-center">
            <img src={`${import.meta.env.BASE_URL}logo-pr.png`} alt="PR Profissional" className="h-10 w-auto" />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-pink-600 transition">Início</a>
          <Link href="/produtos" className="hover:text-pink-600 transition">Produtos</Link>
          <a href="#quem-usa" className="hover:text-pink-600 transition">Quem usa</a>
          <a href="#depoimentos" className="hover:text-pink-600 transition">Depoimentos</a>
          <a href="#faq" className="hover:text-pink-600 transition">FAQ</a>
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
          <a href="#" className="py-1 text-gray-700">Início</a>
          <Link href="/produtos" className="py-1 text-gray-700">Produtos</Link>
          <a href="#quem-usa" className="py-1 text-gray-700">Quem usa</a>
          <a href="#depoimentos" className="py-1 text-gray-700">Depoimentos</a>
          <a href="#faq" className="py-1 text-gray-700">FAQ</a>
        </div>
      )}
    </header>
  );
}

/* ─── HERO ─── */
const heroBgs = ["hero-bg.png", "hero-bg-2.png", "hero-bg-3.png"];

function Hero() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent(c => (c + 1) % heroBgs.length);
        setFading(false);
      }, 600);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Main hero */}
      <section className="relative overflow-hidden" style={{ minHeight: 560 }}>
        {/* Full-cover background image with fade transition */}
        <img
          src={`${import.meta.env.BASE_URL}${heroBgs[current]}`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ transition: "opacity 0.6s ease", opacity: fading ? 0 : 1 }}
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
  { name: "Progressiva sem formol", ml: "1L", price: "R$ 170,00", old: "R$ 250,00", stars: 5, n: 234, color: PINK, badge: "Mais Vendido", img: "product-progressiva.png" },
  { name: "Shampoo e máscara pós química", ml: "300ml", price: "R$ 80,00", old: "R$ 120,00", stars: 5, n: 189, color: "#4a90e2", badge: "Top", img: "product-pos-quimica.png" },
  { name: "Shampoo e máscara de hidratação", ml: "300ml", price: "R$ 80,00", old: "R$ 120,00", stars: 5, n: 312, color: "#ff6b6b", badge: "Favorito", img: "product-hidratacao.png" },
  { name: "Reparador de pontas", ml: "30ml", price: "R$ 45,00", old: "R$ 54,90", stars: 4, n: 156, color: "#43a047", badge: "Novo", img: "product-reparador-pontas.png" },
  { name: "Kit com shampoo máscara e Liven", ml: "300ml", price: "R$ 150,00", old: "R$ 219,90", stars: 5, n: 278, color: "#8e24aa", badge: "Destaque", img: "product-finalizador-liss.png" },
];

function BestSellers() {
  return (
    <section id="produtos" className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-gray-900">Mais Vendidos</h2>
          <Link href="/produtos" style={{ color: PINK }} className="text-sm font-semibold flex items-center gap-0.5 hover:underline">
            Ver todos <ChevronRight size={15} />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
          {bestSellers.map((p, i) => (
            <div key={i} className="flex-shrink-0 w-44 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="relative">
                <span className="absolute top-2 left-2 z-10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: PINK }}>{p.badge}</span>
                {p.img ? (
                  <div style={{
                    height: 130,
                    background: `linear-gradient(145deg, ${p.color}18, ${p.color}35)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden",
                  }}>
                    <img
                      src={`${import.meta.env.BASE_URL}${p.img}`}
                      alt={p.name}
                      style={{ height: 130 * 0.92, width: "auto", objectFit: "contain" }}
                    />
                  </div>
                ) : (
                  <ProductImg color={p.color} height={130} />
                )}
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
  { bg: "#fce4f0", emoji: null, img: "/mosaic-hair.jpg", big: true, scale: "scale-110" },
  { bg: "#e3f2fd", emoji: null, img: "/mosaic-hair-2.jpg", big: false, scale: "scale-100" },
  { bg: "#f3e5f5", emoji: null, img: "/mosaic-hair-3.webp", big: false, scale: "scale-100" },
  { bg: "#e0f7fa", emoji: null, img: "/mosaic-hair-6.jpg", big: false, scale: "scale-100" },
  { bg: "#fff8e1", emoji: null, img: "/mosaic-hair-5.jpg", big: false, scale: "scale-100" },
];

function WhoRecommends() {
  return (
    <section className="py-8" style={{ background: GRAY_BG }}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-black text-center text-gray-900 mb-6">Quem usa Profissional recomenda</h2>
        {/* Mosaic grid */}
        <div className="grid grid-cols-4 gap-2" style={{ gridAutoRows: "140px" }}>
          {mosaicPhotos.map((p, i) => (
            <div key={i}
              className={`rounded-2xl overflow-hidden ${p.big ? "row-span-2 col-span-2" : "col-span-1"}`}>
              <img src={p.img} alt="" className={`w-full h-full object-cover ${p.scale ?? "scale-100"}`} />
            </div>
          ))}
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
      <img
        src={`${import.meta.env.BASE_URL}product-oil-repair-colorful.png`}
        alt="Oil Repair"
        className="absolute right-0 bottom-0 h-full object-contain object-right-bottom pointer-events-none select-none opacity-90"
        style={{ maxWidth: "45%" }}
      />
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
      </div>
    </section>
  );
}

/* ─── BEFORE / AFTER SLIDER ─── */
function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  }, []);

  const onMouseDown = () => { dragging.current = true; };
  const onMouseMove = (e: React.MouseEvent) => { if (dragging.current) updatePos(e.clientX); };
  const onMouseUp = () => { dragging.current = false; };
  const onTouchMove = (e: React.TouchEvent) => updatePos(e.touches[0].clientX);

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden rounded-2xl"
      style={{ width: 300, height: 420, cursor: "ew-resize" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
    >
      <img src={after} alt="Depois" className="absolute inset-0 w-full h-full object-cover object-top" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt="Antes" className="absolute inset-0 w-full h-full object-cover object-top" style={{ width: 300 }} />
      </div>
      <div className="absolute top-0 bottom-0 flex flex-col items-center" style={{ left: `calc(${pos}% - 1px)` }}>
        <div className="w-0.5 flex-1" style={{ background: "white" }} />
        <div className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center flex-shrink-0" style={{ border: `2px solid ${PINK}` }}>
          <span className="text-xs font-black" style={{ color: PINK }}>◀▶</span>
        </div>
        <div className="w-0.5 flex-1" style={{ background: "white" }} />
      </div>
      <span className="absolute top-3 left-3 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ANTES</span>
      <span className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">DEPOIS</span>
    </div>
  );
}

/* ─── RESULTADO MAGIC ─── */
function ResultadoMagic() {
  return (
    <section className="py-10" style={{ background: GRAY_BG }}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-black text-center text-gray-900 mb-2">Resultado Magic</h2>
        <p className="text-center text-gray-500 text-sm mb-8">Veja a transformação real</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex-shrink-0">
            <BeforeAfterSlider before="/before-hair.jpg" after="/after-hair.jpg" />
          </div>
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
  { name: "Fernanda K.", img: "/avatar-1.jpg", stars: 5, text: "Incrível! Meu cabelo ficou liso, brilhoso e saudável desde a primeira aplicação.", date: "15 mar 2026" },
  { name: "Beatriz S.", img: "/avatar-2.jpg", stars: 5, text: "A máscara é um milagre! Nunca vi resultado tão rápido e duradouro.", date: "12 mar 2026" },
  { name: "Priscila A.", img: "/avatar-3.jpg", stars: 5, text: "O finalizador deixa o cabelo com um brilho incomparável. Recomendo!", date: "10 mar 2026" },
  { name: "Renata M.", img: "/avatar-4.jpg", stars: 5, text: "Uso toda a linha e meu cabelo nunca esteve tão saudável.", date: "8 mar 2026" },
];

function WhoUses() {
  return (
    <section id="quem-usa" className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-black text-center text-gray-900 mb-6">Quem usa Profissional recomenda! 💖</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {reviews.map((r, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition">
              <div className="flex items-center gap-2 mb-2">
                <img src={r.img} alt={r.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
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


/* ─── CATEGORIES BANNER ─── */
const categoryCards = [
  { label: "Shampoo e máscara", slug: "shampoo-e-mascara", img: "product-pos-quimica.png", color: "#d0eaf8", textColor: "#1a5276", big: true },
  { label: "Reparador de pontas", slug: "reparador-de-pontas", img: "product-oil-repair.png", color: "#d5f0e0", textColor: "#1a5c2e", big: false },
  { label: "Progressiva sem formol", slug: "progressiva-sem-formol", img: "product-progressiva.png", color: "#fde8f0", textColor: "#7b1040", big: false },
  { label: "Finalizadores", slug: "finalizadores", img: "product-finalizador-liss.png", color: "#fce4ec", textColor: "#880e4f", big: false },
];

function CategoriesBanner() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-4 grid-rows-2 gap-3" style={{ height: 320 }}>
          {/* Big card left — spans 2 cols, 2 rows */}
          <Link href={`/categoria/${categoryCards[0].slug}`}
            className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative cursor-pointer hover:scale-[1.01] transition-transform block"
            style={{ background: categoryCards[0].color }}>
            <img src={`${import.meta.env.BASE_URL}${categoryCards[0].img}`} alt={categoryCards[0].label}
              className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
            <span className="absolute bottom-4 left-4 text-white font-black text-xl drop-shadow">{categoryCards[0].label}</span>
          </Link>
          {/* Right: 2 stacked cards filling right half */}
          {categoryCards.slice(1, 3).map((cat, i) => (
            <Link key={i} href={`/categoria/${cat.slug}`}
              className="col-span-2 row-span-1 rounded-2xl overflow-hidden relative cursor-pointer hover:scale-[1.02] transition-transform block"
              style={{ background: cat.color }}>
              <img src={`${import.meta.env.BASE_URL}${cat.img}`} alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl" />
              <span className="absolute bottom-3 left-3 text-white font-black text-sm drop-shadow">{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TOUT LISSIE A QUERIDINHA DOS SALÕES ─── */
const salonReviews = [
  { name: "Ana C.", role: "Cabeleireira profissional", img: "/avatar-5.jpg", stars: 5, text: "Meus clientes amam os resultados! Uso Profissional em todos os atendimentos." },
  { name: "Mariana T.", role: "Salão de Beleza SP", img: "/avatar-6.jpg", stars: 5, text: "A linha é perfeita para cabelos difíceis. Resultados surpreendentes!" },
  { name: "Renata P.", role: "Hair Stylist", img: "/avatar-7.jpg", stars: 5, text: "Qualidade profissional a um preço acessível. Super recomendo!" },
  { name: "Luana B.", role: "Salão Chic RJ", img: "/avatar-8.jpg", stars: 5, text: "Desde que comecei a usar Profissional, minhas clientes voltam sempre!" },
];

function SalonSection() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-black text-center text-gray-900 mb-2">
          Profissional a queridinha dos salões <span style={{ color: PINK }}>♥</span>
        </h2>
        <p className="text-center text-sm text-gray-500 mb-7">Profissionais que confiam na qualidade Profissional</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {salonReviews.map((r, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition">
              <div className="flex items-center gap-2 mb-2">
                <img src={r.img} alt={r.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
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
  { q: "Como usar o shampoo Profissional?", a: "Aplique sobre os cabelos molhados, massageie o couro cabeludo por 2 a 3 minutos e enxágue bem. Para melhores resultados, use com o condicionador da linha." },
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
                <a href="https://wa.me/5511953770968" target="_blank" rel="noopener noreferrer"
                  className="w-full bg-white font-bold rounded-full py-2.5 text-sm hover:bg-pink-50 transition flex items-center justify-center gap-2"
                  style={{ color: PINK }}>
                  <MessageCircle size={16} /> Falar pelo WhatsApp
                </a>
                <a href="https://mail.google.com/mail/?view=cm&to=Prprofissional0111@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border-2 border-white text-white font-bold rounded-full py-2.5 text-sm hover:bg-white/10 transition flex items-center justify-center">
                  Enviar e-mail
                </a>
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
              <img src={`${import.meta.env.BASE_URL}logo-pr.png`} alt="PR Profissional" className="h-10 w-auto" />
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
          <p className="text-white/60 text-xs">© 2026 Profissional. Todos os direitos reservados.</p>
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
      <ResultadoMagic />
      <WhoUses />
      <CategoriesBanner />
      <SalonSection />
      <FAQ />
      <Footer />
    </div>
  );
}
