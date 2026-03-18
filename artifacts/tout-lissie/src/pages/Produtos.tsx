import { useState } from "react";
import { ShoppingCart, Star, Heart, User, Menu, X, Search, ChevronRight, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Link } from "wouter";

const PINK = "#e8006f";
const PINK2 = "#f5007a";
const DARK_RED = "#c0003d";
const GRAY_BG = "#f8f8f8";

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
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/">
            <div className="flex flex-col leading-[1.1] cursor-pointer">
              <div className="flex items-center gap-1">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black"
                  style={{ background: PINK }}>T</div>
                <span className="font-black text-lg tracking-tight" style={{ color: "#1a1a1a" }}>Tout</span>
                <span className="font-black text-lg tracking-tight" style={{ color: PINK }}> Lissie</span>
              </div>
              <span className="text-[9px] text-gray-400 font-medium tracking-widest uppercase pl-8">Hair Care</span>
            </div>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-pink-600 transition">Início</Link>
          <span style={{ color: PINK, borderColor: PINK, paddingBottom: 2 }} className="font-bold border-b-2">Produtos</span>
          <Link href="/#quem-usa" className="hover:text-pink-600 transition">Quem usa</Link>
          <Link href="/#depoimentos" className="hover:text-pink-600 transition">Depoimentos</Link>
          <Link href="/#faq" className="hover:text-pink-600 transition">FAQ</Link>
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5 bg-gray-50">
            <Search size={14} className="text-gray-400" />
            <input className="bg-transparent text-sm outline-none w-32 text-gray-700"
              placeholder="Buscar produtos..." />
          </div>
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
          <span style={{ color: PINK }} className="py-1 font-bold">Produtos</span>
          <Link href="/#quem-usa" className="py-1 text-gray-700">Quem usa</Link>
          <Link href="/#depoimentos" className="py-1 text-gray-700">Depoimentos</Link>
          <Link href="/#faq" className="py-1 text-gray-700">FAQ</Link>
        </div>
      )}
    </header>
  );
}

const allProducts = [
  { name: "Progressiva sem formol", ml: "1L", price: "R$ 170,00", old: "R$ 250,00", stars: 5, n: 234, color: PINK, badge: "Mais Vendido", img: "product-progressiva.png", category: "Progressiva" },
  { name: "Shampoo e máscara pós química", ml: "300ml", price: "R$ 80,00", old: "R$ 120,00", stars: 5, n: 189, color: "#4a90e2", badge: "Top", img: "product-pos-quimica.png", category: "Shampoos" },
  { name: "Shampoo e máscara de hidratação", ml: "300ml", price: "R$ 80,00", old: "R$ 120,00", stars: 5, n: 312, color: "#ff6b6b", badge: "Favorito", img: "product-hidratacao.png", category: "Máscaras" },
  { name: "Reparador de pontas", ml: "30ml", price: "R$ 45,00", old: "R$ 54,90", stars: 4, n: 156, color: "#43a047", badge: "Novo", img: "product-reparador-pontas.png", category: "Finalizadores" },
  { name: "Kit com shampoo máscara e Liven", ml: "300ml", price: "R$ 150,00", old: "R$ 219,90", stars: 5, n: 278, color: "#8e24aa", badge: "Destaque", img: "product-finalizador-liss.png", category: "Kits" },
  { name: "Óleo de Argan Premium", ml: "60ml", price: "R$ 65,00", old: "R$ 89,90", stars: 5, n: 201, color: "#f59e0b", badge: "Novo", img: "product-megaliss.png", category: "Óleos" },
  { name: "Condicionador Hidratação Intensa", ml: "300ml", price: "R$ 55,00", old: "R$ 79,90", stars: 5, n: 143, color: "#06b6d4", badge: "Top", img: "product-pos-quimica.png", category: "Condicionadores" },
  { name: "Máscara Reconstrução Profunda", ml: "500g", price: "R$ 95,00", old: "R$ 139,90", stars: 5, n: 267, color: "#ec4899", badge: "Favorito", img: "product-hidratacao.png", category: "Máscaras" },
  { name: "Shampoo Antiqueda Fortalecedor", ml: "300ml", price: "R$ 60,00", old: "R$ 84,90", stars: 4, n: 98, color: "#10b981", badge: "Novo", img: "product-pos-quimica.png", category: "Shampoos" },
];

const categories = ["Todos", "Shampoos", "Condicionadores", "Máscaras", "Finalizadores", "Óleos", "Kits", "Progressiva"];

export default function Produtos() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  const filtered = allProducts.filter(p => {
    const matchCat = activeCategory === "Todos" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-1 text-xs text-gray-400">
        <Link href="/" className="hover:text-pink-600 transition">Início</Link>
        <ChevronRight size={12} />
        <span style={{ color: PINK }} className="font-semibold">Produtos</span>
      </div>

      {/* Hero banner */}
      <div style={{ background: `linear-gradient(120deg, ${DARK_RED}, ${PINK})` }}
        className="py-10 px-4 text-center text-white mb-8">
        <h1 className="font-black text-3xl md:text-4xl mb-2">Nossos Produtos</h1>
        <p className="text-white/80 text-sm">Linha completa para o cuidado dos seus fios</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-1.5 rounded-full text-sm font-semibold transition border"
                style={activeCategory === cat
                  ? { background: PINK, color: "white", borderColor: PINK }
                  : { background: "white", color: "#666", borderColor: "#e5e7eb" }}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5 bg-gray-50 w-full md:w-56">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              className="bg-transparent text-sm outline-none w-full text-gray-700"
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-gray-400 mb-5">{filtered.length} produto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</p>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-semibold">Nenhum produto encontrado</p>
            <p className="text-sm mt-1">Tente outra categoria ou busca</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((p, i) => (
              <div key={i} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col">
                <div className="relative">
                  <span className="absolute top-2 left-2 z-10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: PINK }}>{p.badge}</span>
                  <img
                    src={`${import.meta.env.BASE_URL}${p.img}`}
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: PINK }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-black text-sm" style={{ color: PINK }}>T</div>
              <span className="font-black text-xl">Tout Lissie</span>
            </div>
            <div className="flex gap-3">
              {[Instagram, Facebook, MessageCircle].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
                  <Icon size={15} />
                </a>
              ))}
            </div>
            <p className="text-white/60 text-xs">© 2026 Tout Lissie. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
