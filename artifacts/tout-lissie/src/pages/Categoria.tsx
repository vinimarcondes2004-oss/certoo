import { ShoppingCart, Star, Heart, User, Menu, X, Search, ChevronRight, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Link, useParams } from "wouter";
import { useState } from "react";
import { useSite } from "@/context/SiteContext";

const PINK = "#e8006f";
const PINK2 = "#f5007a";
const DARK_RED = "#c0003d";

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

function BuyBtn() {
  return (
    <button style={{ background: PINK }}
      className="w-full text-white text-xs font-bold rounded-full px-4 py-2 hover:opacity-90 transition">
      Comprar
    </button>
  );
}

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

function Header() {
  const [open, setOpen] = useState(false);
  const { data } = useSite();
  const logo = data.settings.logo || "logo-pr.png";
  const logoSrc = logo.startsWith("data:") || logo.startsWith("http") ? logo : `${import.meta.env.BASE_URL}${logo}`;
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/">
            <img src={logoSrc} alt={data.settings.siteName} className="h-10 w-auto" />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-pink-600 transition">Início</Link>
          <Link href="/produtos" className="hover:text-pink-600 transition">Produtos</Link>
          <Link href="/#quem-usa" className="hover:text-pink-600 transition">Quem usa</Link>
          <Link href="/#depoimentos" className="hover:text-pink-600 transition">Depoimentos</Link>
          <Link href="/#faq" className="hover:text-pink-600 transition">FAQ</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button className="relative p-1.5">
            <ShoppingCart size={20} className="text-gray-700" />
          </button>
          <button className="p-1.5 hidden md:block"><User size={20} className="text-gray-700" /></button>
          <button className="p-1.5 hidden md:block"><Heart size={20} className="text-gray-700" /></button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-3 text-sm font-medium bg-white">
          <Link href="/" className="py-1 text-gray-700">Início</Link>
          <Link href="/produtos" className="py-1 text-gray-700">Produtos</Link>
          <Link href="/#quem-usa" className="py-1 text-gray-700">Quem usa</Link>
          <Link href="/#faq" className="py-1 text-gray-700">FAQ</Link>
        </div>
      )}
    </header>
  );
}

export default function Categoria() {
  const { data } = useSite();
  const { slug } = useParams<{ slug: string }>();
  const logo = data.settings.logo || "logo-pr.png";
  const logoSrc = logo.startsWith("data:") || logo.startsWith("http") ? logo : `${import.meta.env.BASE_URL}${logo}`;
  const normalize = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const products = data.products.filter(p => {
    const s = normalize(slug || "");
    return normalize(p.category || "") === s
      || (p.extraCategories || []).some(e => normalize(e) === s)
      || normalize(p.categoryLabel || "") === s;
  });
  const primaryMatch = products.find(p =>
    normalize(p.category || "") === normalize(slug || "") ||
    normalize(p.categoryLabel || "") === normalize(slug || "")
  );
  const rawLabel = primaryMatch?.categoryLabel ?? (slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ") : "");
  const label = rawLabel;

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-1 text-xs text-gray-400">
        <Link href="/" className="hover:text-pink-600 transition">Início</Link>
        <ChevronRight size={12} />
        <Link href="/produtos" className="hover:text-pink-600 transition">Produtos</Link>
        <ChevronRight size={12} />
        <span style={{ color: PINK }} className="font-semibold">{label}</span>
      </div>

      {/* Hero banner */}
      <div style={{ background: `linear-gradient(120deg, ${DARK_RED}, ${PINK})` }}
        className="py-10 px-4 text-center text-white mb-8">
        <h1 className="font-black text-3xl md:text-4xl mb-2">{label}</h1>
        <p className="text-white/80 text-sm">{products.length} produto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-semibold">Nenhum produto encontrado</p>
            <p className="text-sm mt-1">Em breve novidades nessa categoria!</p>
            <Link href="/produtos">
              <button style={{ background: PINK }}
                className="mt-6 text-white text-sm font-bold rounded-full px-6 py-2.5 hover:opacity-90 transition">
                Ver todos os produtos
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((p, i) => (
              <Link key={p.id} href={`/produto/${p.id}`} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col block">
                <div className="relative">
                  <span className="absolute top-2 left-2 z-10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: PINK }}>{p.badge}</span>
                  <img
                    src={p.img.startsWith("http") ? p.img : `${import.meta.env.BASE_URL}${p.img}`}
                    alt={p.name}
                    style={{ height: 150, width: "100%", objectFit: "contain" }}
                  />
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <p className="font-bold text-xs text-gray-800 leading-tight mb-0.5">{p.name}</p>
                  <p className="text-[11px] text-gray-400 mb-1">{p.ml}</p>
                  <Stars n={p.stars} size={11} />
                  <p className="text-[10px] text-gray-400 line-through mt-1">{p.old}</p>
                  <p className="font-black text-sm mb-3" style={{ color: PINK }}>{p.price}</p>
                  <div className="mt-auto">
                    <BuyBtn />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer style={{ background: PINK }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <img src={logoSrc} alt={data.settings.siteName} className="h-10 w-auto" onError={e => (e.currentTarget.style.display = "none")} />
            <div className="flex gap-3">
              {[Instagram, Facebook, MessageCircle].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
                  <Icon size={15} />
                </a>
              ))}
            </div>
            <p className="text-white/60 text-xs">© 2026 Profissional. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
