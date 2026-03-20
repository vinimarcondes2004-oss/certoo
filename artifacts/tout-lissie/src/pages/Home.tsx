import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import {
  ShoppingCart, Star, ChevronDown, ChevronUp, Search,
  Heart, User, Menu, X, Instagram, Facebook, MessageCircle, ChevronRight
} from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { useCart } from "@/context/CartContext";
import { FavBtn, FavIconBtn } from "@/components/FavBtn";
import { DEFAULT_SECTION_LAYOUT } from "@/lib/siteData";

const PINK = "#e8006f";
const GRAY_BG = "#f8f8f8";

function imgSrc(v: string) {
  if (!v) return "";
  return v.startsWith("data:") || v.startsWith("http") ? v : `${import.meta.env.BASE_URL}${v}`;
}

/* ─── helpers ─── */
function Stars({ n = 5, size = 12 }: { n?: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} fill={i <= n ? "#f5a623" : "none"} stroke={i <= n ? "#f5a623" : "#ddd"} />
      ))}
    </span>
  );
}

interface BuyBtnProps {
  label?: string;
  full?: boolean;
  product?: { id: string; name: string; price: string; img: string; color: string };
}
function BuyBtn({ label = "Comprar", full, product }: BuyBtnProps) {
  const { addItem } = useCart();
  return (
    <button
      style={{ background: PINK }}
      className={`text-white text-xs font-bold rounded-full px-4 py-1.5 hover:opacity-90 transition whitespace-nowrap ${full ? "w-full py-2 text-sm" : ""}`}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        if (product) addItem(product);
      }}
    >
      {label}
    </button>
  );
}

/* ─── HEADER ─── */
function Header() {
  const { data } = useSite();
  const { totalItems, openCart } = useCart();
  const [open, setOpen] = useState(false);
  const logo = data.settings.logo || "logo-pr.png";
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/" className="flex items-center">
            <img src={imgSrc(logo)} alt={data.settings.siteName} className="h-10 w-auto" onError={e => (e.currentTarget.style.display = "none")} />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-pink-600 transition">Início</Link>
          <Link href="/produtos" className="hover:text-pink-600 transition">Produtos</Link>
          <a href="#quem-usa" className="hover:text-pink-600 transition">Quem usa</a>
          <a href="#faq" className="hover:text-pink-600 transition">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5 bg-gray-50">
            <Search size={14} className="text-gray-400" />
            <input className="bg-transparent text-sm outline-none w-32 text-gray-700" placeholder="Buscar produtos..." />
          </div>
          <button className="relative p-1.5" onClick={openCart}>
            <ShoppingCart size={20} className="text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold" style={{ background: PINK }}>
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>
          <Link href="/perfil" className="p-1.5 hidden md:block"><User size={20} className="text-gray-700" /></Link>
          <FavIconBtn />
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-3 text-sm font-medium bg-white">
          <Link href="/" className="py-1 text-gray-700">Início</Link>
          <Link href="/produtos" className="py-1 text-gray-700">Produtos</Link>
          <a href="#quem-usa" className="py-1 text-gray-700">Quem usa</a>
          <a href="#faq" className="py-1 text-gray-700">FAQ</a>
        </div>
      )}
    </header>
  );
}

/* ─── HERO ─── */
function Hero() {
  const { data } = useSite();
  const slides = data.heroSlides;
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => { setCurrent(c => (c + 1) % slides.length); }, 3500);
    return () => clearInterval(timer);
  }, [slides.length]);
  const slide = slides[current] ?? slides[0];
  return (
    <section className="relative overflow-hidden" style={{ minHeight: 700 }}>
      {slides.map((s, i) => (
        <img key={s.id} src={imgSrc(s.img)} alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading={i === 0 ? "eager" : "lazy"}
          style={{ transition: "opacity 0.8s ease", opacity: i === current ? 1 : 0 }} />
      ))}
      <div className="absolute inset-0" style={{ background: "rgba(180,0,60,0.65)" }} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 pt-28 flex flex-col items-center justify-center text-center">
        <div className="text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 opacity-90">{slide?.subtitle}</p>
          <h1 className="font-black text-4xl md:text-5xl leading-[1.1] mb-5">
            {(slide?.title ?? "").split("\n").map((line, i) => <span key={i}>{line}{i < (slide?.title ?? "").split("\n").length - 1 && <br />}</span>)}
          </h1>
          <a href="#produtos">
            <button className="bg-white font-black rounded-full px-7 py-2.5 text-sm hover:bg-pink-50 transition" style={{ color: PINK }}>
              {slide?.buttonText}
            </button>
          </a>
        </div>
      </div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className="rounded-full transition-all"
            style={{ width: i === current ? 24 : 8, height: 8, background: i === current ? "white" : "rgba(255,255,255,0.5)" }} />
        ))}
      </div>
    </section>
  );
}

/* ─── MAIS VENDIDOS ─── */
function BestSellers() {
  const { data } = useSite();
  return (
    <section id="produtos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-2xl font-black text-gray-900">{data.sectionTitles.bestSellers}</h2>
          <Link href="/produtos" style={{ color: PINK }} className="text-sm font-semibold flex items-center gap-0.5 hover:underline">
            Ver todos <ChevronRight size={15} />
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
          {data.products.filter(p => p.showInBestSellers !== false).map((p) => (
            <Link key={p.id} href={`/produto/${p.id}`} className="flex-shrink-0 w-56 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col">
              <div className="relative">
                {p.outOfStock
                  ? <span className="absolute top-2 left-2 z-10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-500">Esgotado</span>
                  : <span className="absolute top-2 left-2 z-10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: PINK }}>{p.badge}</span>
                }
                <FavBtn productId={p.id} />
                <div style={{ height: 180, background: `linear-gradient(145deg, ${p.color}18, ${p.color}35)`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", opacity: p.outOfStock ? 0.5 : 1 }}>
                  <img src={imgSrc(p.img)} alt={p.name} style={{ height: 180 * 0.92, width: "auto", objectFit: "contain" }} />
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="font-bold text-sm text-gray-800 leading-tight mb-1">{p.name}</p>
                <p className="text-xs text-gray-400 mb-1.5">{p.ml}</p>
                <Stars n={p.stars} size={13} />
                <p className="text-xs text-gray-400 line-through mt-1.5">{p.old}</p>
                <p className="font-black text-base mb-3" style={{ color: PINK }}>{p.price}</p>
                <div className="mt-auto">
                  {p.outOfStock
                    ? <button disabled className="w-full py-2 text-sm text-gray-400 bg-gray-100 rounded-full font-bold cursor-not-allowed">Esgotado</button>
                    : <BuyBtn full product={{ id: p.id, name: p.name, price: p.price, img: p.img, color: p.color }} />
                  }
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── helpers ─── */
function toYoutubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}?autoplay=0&rel=0`;
    }
    if (u.hostname.includes("youtu.be")) {
      const v = u.pathname.slice(1);
      if (v) return `https://www.youtube.com/embed/${v}?autoplay=0&rel=0`;
    }
  } catch {}
  return null;
}

/* ─── QUEM USA (mosaico de fotos) ─── */
function WhoRecommends() {
  const { data } = useSite();
  const photos = data.mosaicPhotos;
  const track = [...photos, ...photos];

  return (
    <section className="py-24" style={{ background: GRAY_BG }}>
      <h2 className="text-2xl font-black text-center text-gray-900 mb-8 px-4">{data.sectionTitles.whoRecommends}</h2>

      <style>{`
        @keyframes mosaic-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .mosaic-slider {
          overflow: hidden;
          width: 100%;
          position: relative;
        }
        .mosaic-slider::before,
        .mosaic-slider::after {
          content: "";
          position: absolute;
          top: 0;
          width: 120px;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }
        .mosaic-slider::before {
          left: 0;
          background: linear-gradient(to right, ${GRAY_BG}, transparent);
        }
        .mosaic-slider::after {
          right: 0;
          background: linear-gradient(to left, ${GRAY_BG}, transparent);
        }
        .mosaic-track {
          display: flex;
          width: max-content;
          animation: mosaic-scroll ${Math.max(photos.length * 5, 30)}s linear infinite;
        }
        .mosaic-slider:hover .mosaic-track {
          animation-play-state: paused;
        }
        .mosaic-card {
          width: 220px;
          height: 380px;
          margin: 0 12px;
          border-radius: 18px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          transition: transform 0.3s;
          flex-shrink: 0;
        }
        .mosaic-card:hover {
          transform: scale(1.05);
        }
        .mosaic-card img,
        .mosaic-card video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>

      <div className="mosaic-slider">
        <div className="mosaic-track">
          {track.map((p, i) => {
            const isVideo = p.type === "video";
            const ytEmbed = isVideo && p.videoUrl ? toYoutubeEmbed(p.videoUrl) : null;
            const isDirectVideo = isVideo && p.videoUrl && !ytEmbed;
            return (
              <div key={`${p.id ?? i}-${i}`} className="mosaic-card">
                {isVideo ? (
                  ytEmbed ? (
                    <iframe
                      src={ytEmbed}
                      style={{ width: "100%", height: "100%", border: "none" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`video-${p.id}`}
                    />
                  ) : isDirectVideo ? (
                    <video
                      src={p.videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center", color: "#666", fontSize: 12 }}>Sem vídeo</div>
                  )
                ) : (
                  <img src={imgSrc(p.img)} alt="" onError={e => (e.currentTarget.style.display = "none")} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── ELEGANCE BANNER ─── */
function EleganceBanner() {
  const { data } = useSite();
  const eb = data.eleganceBanner;
  return (
    <section className="relative overflow-hidden flex items-center" style={{ minHeight: 720 }}>
      <img src={imgSrc(eb.img)} alt="Banner"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        onError={e => (e.currentTarget.style.display = "none")} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(26,0,16,0.82) 0%, rgba(61,0,32,0.70) 50%, rgba(0,0,0,0.10) 100%)" }} />
      <div className="w-full max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center gap-8 relative z-10">
        <div className="flex-1">
          <p style={{ color: "#ff88bb" }} className="text-sm font-semibold uppercase tracking-widest mb-2">{eb.tagline}</p>
          <h2 className="text-white font-black text-4xl md:text-5xl leading-tight mb-3">
            {eb.title} <span style={{ color: "#ff88bb" }}>{eb.titleHighlight}</span>
          </h2>
          <p className="text-white/60 text-sm mb-6">{eb.subtitle}</p>
          <button style={{ background: PINK }} className="text-white font-bold rounded-full px-7 py-2.5 text-sm hover:opacity-90 transition">
            {eb.buttonText}
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
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }, []);
  return (
    <div ref={containerRef} className="relative select-none overflow-hidden rounded-2xl"
      style={{ width: 300, height: 420, cursor: "ew-resize" }}
      onMouseDown={() => { dragging.current = true; }}
      onMouseMove={e => { if (dragging.current) updatePos(e.clientX); }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchMove={e => updatePos(e.touches[0].clientX)}>
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
    </div>
  );
}

/* ─── RESULTADO MAGIC ─── */
function ResultadoMagic() {
  const { data } = useSite();
  const rm = data.resultadoMagic;
  return (
    <section className="py-24" style={{ background: GRAY_BG }}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-black text-center text-gray-900 mb-3">{rm.title}</h2>
        <p className="text-center text-gray-500 text-sm mb-10">{rm.subtitle}</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex-shrink-0">
            <BeforeAfterSlider before={imgSrc(rm.beforeImg)} after={imgSrc(rm.afterImg)} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── QUEM USA (avaliações) ─── */
function WhoUses() {
  const { data } = useSite();
  const reviews = data.reviews;
  const track = [...reviews, ...reviews];

  return (
    <section id="quem-usa" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-9">
        <h2 className="text-2xl font-black text-center text-gray-900">{data.sectionTitles.whoUses}</h2>
      </div>

      <style>{`
        @keyframes reviews-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .reviews-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: reviews-scroll ${reviews.length * 4}s linear infinite;
        }
        .reviews-track:hover {
          animation-play-state: paused;
        }
        .reviews-card {
          width: 260px;
          flex-shrink: 0;
          border: 1px solid #f0f0f0;
          border-radius: 16px;
          padding: 24px;
          background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          transition: box-shadow 0.2s;
        }
        .reviews-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
      `}</style>

      <div className="w-full overflow-hidden px-4">
        <div className="reviews-track">
          {track.map((r, i) => (
            <div key={`${r.id}-${i}`} className="reviews-card">
              <div className="flex items-center gap-3 mb-3">
                <img src={imgSrc(r.img)} alt={r.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" onError={e => (e.currentTarget.style.display = "none")} />
                <div>
                  <p className="font-bold text-sm text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
              </div>
              <Stars n={r.stars} size={14} />
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CATEGORIES BANNER ─── */
function CategoriesBanner() {
  const { data } = useSite();
  const cards = data.categoryCards;
  if (!cards.length) return null;
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-4 grid-rows-2 gap-3" style={{ height: 460 }}>
          {/* Big card — first one */}
          <Link href={`/categoria/${cards[0].slug}`}
            className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative cursor-pointer hover:scale-[1.01] transition-transform block"
            style={{ background: cards[0].color }}>
            <img src={imgSrc(cards[0].img)} alt={cards[0].label} className="absolute inset-0 w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
            <span className="absolute bottom-4 left-4 text-white font-black text-xl drop-shadow">{cards[0].label}</span>
          </Link>
          {/* Remaining cards */}
          {cards.slice(1, 3).map((cat, i) => (
            <Link key={i} href={`/categoria/${cat.slug}`}
              className="col-span-2 row-span-1 rounded-2xl overflow-hidden relative cursor-pointer hover:scale-[1.02] transition-transform block"
              style={{ background: cat.color }}>
              <img src={imgSrc(cat.img)} alt={cat.label} className="absolute inset-0 w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl" />
              <span className="absolute bottom-3 left-3 text-white font-black text-sm drop-shadow">{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── VITRINE DE PRODUTOS ─── */
function FeaturedCategory() {
  const { data } = useSite();
  const title = data.sectionTitles.featuredTitle || "Kits";
  const cat = (data.sectionTitles.featuredCategory || "").trim().toLowerCase();
  const products = cat
    ? data.products.filter(p => {
        const c = cat.toLowerCase();
        return (p.category || "").toLowerCase() === c
          || (p.categoryLabel || "").toLowerCase() === c
          || (p.extraCategories || []).some(e => e.toLowerCase() === c);
      })
    : data.products;
  if (products.length === 0) return null;
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-2xl font-black text-gray-900">{title}</h2>
          <Link href={cat ? `/categoria/${cat}` : "/produtos"}>
            <span className="inline-flex items-center gap-1 text-sm font-semibold hover:underline" style={{ color: PINK }}>
              Ver mais <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs" style={{ background: PINK }}><ChevronRight size={12} /></span>
            </span>
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
          {products.map((p) => (
            <Link key={p.id} href={`/produto/${p.id}`} className="flex-shrink-0 w-56 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col">
              <div className="relative">
                {p.outOfStock
                  ? <span className="absolute top-2 left-2 z-10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-500">Esgotado</span>
                  : p.badge ? <span className="absolute top-2 left-2 z-10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: PINK }}>{p.badge}</span> : null
                }
                <FavBtn productId={p.id} />
                <div style={{ height: 180, background: `linear-gradient(145deg, ${p.color}18, ${p.color}35)`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", opacity: p.outOfStock ? 0.5 : 1 }}>
                  <img src={imgSrc(p.img)} alt={p.name} style={{ height: 180 * 0.92, width: "auto", objectFit: "contain" }} />
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="font-bold text-sm text-gray-800 leading-tight mb-1">{p.name}</p>
                <p className="text-xs text-gray-400 mb-1.5">{p.ml}</p>
                <Stars n={p.stars} size={13} />
                <p className="text-xs text-gray-400 line-through mt-1.5">{p.old}</p>
                <p className="font-black text-base mb-3" style={{ color: PINK }}>{p.price}</p>
                <div className="mt-auto">
                  {p.outOfStock
                    ? <button disabled className="w-full py-2 text-sm text-gray-400 bg-gray-100 rounded-full font-bold cursor-not-allowed">Esgotado</button>
                    : <BuyBtn full product={{ id: p.id, name: p.name, price: p.price, img: p.img, color: p.color }} />
                  }
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SALÕES ─── */
function SalonSection() {
  const { data } = useSite();
  const reviews = data.salonReviews;
  const track = [...reviews, ...reviews];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-9">
        <h2 className="text-2xl font-black text-center text-gray-900 mb-2">
          {data.sectionTitles.salonSection} <span style={{ color: PINK }}>♥</span>
        </h2>
        <p className="text-center text-sm text-gray-500">{data.sectionTitles.salonSubtitle}</p>
      </div>

      <style>{`
        @keyframes salon-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .salon-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: salon-scroll ${reviews.length * 4}s linear infinite;
        }
        .salon-track:hover {
          animation-play-state: paused;
        }
        .salon-card {
          width: 260px;
          flex-shrink: 0;
          border: 1px solid #f0f0f0;
          border-radius: 16px;
          padding: 24px;
          background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          transition: box-shadow 0.2s;
        }
        .salon-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
      `}</style>

      <div className="w-full overflow-hidden px-4">
        <div className="salon-track">
          {track.map((r, i) => (
            <div key={`${r.id}-${i}`} className="salon-card">
              <div className="flex items-center gap-3 mb-3">
                <img src={imgSrc(r.img)} alt={r.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" onError={e => (e.currentTarget.style.display = "none")} />
                <div>
                  <p className="font-bold text-sm text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.role}</p>
                </div>
              </div>
              <Stars n={r.stars} size={14} />
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FAQ() {
  const { data } = useSite();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" style={{ background: GRAY_BG }} className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-black text-gray-900 mb-8">{data.sectionTitles.faq}</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-2">
            {data.faqs.map((f, i) => (
              <div key={f.id} className="bg-white rounded-xl overflow-hidden border border-gray-100">
                <button className="w-full flex items-center justify-between px-5 py-3.5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}>
                  <span className="font-semibold text-sm text-gray-800">{f.q}</span>
                  {open === i ? <ChevronUp size={16} style={{ color: PINK }} className="flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                </button>
                {open === i && <div className="px-5 pb-4"><p className="text-sm text-gray-600 leading-relaxed">{f.a}</p></div>}
              </div>
            ))}
          </div>
          <div className="md:w-72 flex-shrink-0">
            <div style={{ background: `linear-gradient(135deg, ${PINK}, #ff6bb3)` }}
              className="rounded-2xl p-6 text-white h-full flex flex-col justify-between min-h-[280px]">
              <div>
                <h3 className="font-black text-xl mb-2">{data.sectionTitles.faqCta}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{data.sectionTitles.faqCtaSubtitle}</p>
              </div>
              <div className="space-y-2 mt-6">
                <a href={`https://wa.me/${data.settings.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="w-full bg-white font-bold rounded-full py-2.5 text-sm hover:bg-pink-50 transition flex items-center justify-center gap-2"
                  style={{ color: PINK }}>
                  <MessageCircle size={16} /> Falar pelo WhatsApp
                </a>
                <a href={`https://mail.google.com/mail/?view=cm&to=${data.settings.email}`} target="_blank" rel="noopener noreferrer"
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
  const { data } = useSite();
  const logo = data.settings.logo || "logo-pr.png";
  const instaUrl = data.settings.instagram || "";
  const fbUrl = data.settings.facebook || "";
  const waUrl = `https://wa.me/${data.settings.whatsapp}`;
  const productLinks = data.footerLinks.filter(l => l.column === "products");
  const companyLinks = data.footerLinks.filter(l => l.column === "company");
  const supportLinks = data.footerLinks.filter(l => l.column === "support");
  const paymentMethods = (data.settings.paymentMethods || "Visa,Master,Pix,Boleto").split(",").map(s => s.trim()).filter(Boolean);

  return (
    <footer style={{ background: PINK }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <img src={imgSrc(logo)} alt={data.settings.siteName} className="h-10 w-auto" onError={e => (e.currentTarget.style.display = "none")} />
            </div>
            <p className="text-white/75 text-sm leading-relaxed mb-4">{data.settings.footerAbout}</p>
            <div className="flex gap-3">
              {instaUrl && (
                <a href={instaUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
                  <Instagram size={15} />
                </a>
              )}
              {fbUrl && (
                <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
                  <Facebook size={15} />
                </a>
              )}
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
                <MessageCircle size={15} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-white/60">Produtos</h4>
            <ul className="space-y-1.5 text-sm text-white/80">
              {productLinks.map(item => (
                <li key={item.id}><Link href={item.href} className="hover:text-white transition">{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-white/60">Empresa</h4>
            <ul className="space-y-1.5 text-sm text-white/80">
              {companyLinks.map(item => (
                <li key={item.id}><Link href={item.href} className="hover:text-white transition">{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-white/60">Suporte</h4>
            <ul className="space-y-1.5 text-sm text-white/80">
              {supportLinks.map(item => (
                <li key={item.id}><Link href={item.href} className="hover:text-white transition">{item.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="text-white/60 text-xs">{data.settings.footerCopyright || `© 2026 ${data.settings.siteName}. Todos os direitos reservados.`}</p>
            <Link href="/admin" className="text-white/30 text-xs hover:text-white/60 transition">Admin</Link>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-white/50 text-xs">Pagamentos:</span>
            {paymentMethods.map(p => (
              <span key={p} className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded font-medium">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE ─── */
const SECTION_MAP: Record<string, React.FC> = {
  hero: Hero,
  categories: CategoriesBanner,
  bestSellers: BestSellers,
  mosaico: WhoRecommends,
  elegance: EleganceBanner,
  resultadoMagic: ResultadoMagic,
  reviews: WhoUses,
  featured: FeaturedCategory,
  salon: SalonSection,
  faq: FAQ,
};

export default function Home() {
  const { data } = useSite();
  const layout = (Array.isArray(data.sectionLayout) && data.sectionLayout.length > 0)
    ? data.sectionLayout
    : DEFAULT_SECTION_LAYOUT;
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {layout.map(s => {
        if (!s.visible) return null;
        const Comp = SECTION_MAP[s.id];
        return Comp ? <Comp key={s.id} /> : null;
      })}
      <Footer />
    </div>
  );
}
