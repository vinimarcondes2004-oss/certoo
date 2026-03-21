import { useState } from "react";
import { ShoppingCart, Star, Search, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useSite } from "@/context/SiteContext";
import { useCart } from "@/context/CartContext";
import { FavBtn } from "@/components/FavBtn";
import { SharedHeader } from "@/components/SharedHeader";
import { SharedFooter } from "@/components/SharedFooter";

const PINK = "#e8006f";
const DARK_RED = "#c0003d";

function Stars({ n = 5, size = 12 }: { n?: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size}
          fill={i <= n ? "#f5a623" : "none"}
          stroke={i <= n ? "#f5a623" : "#ddd"} />
      ))}
    </span>
  );
}

function BuyBtn({ product }: { product?: { id: string; name: string; price: string; img: string; color: string } }) {
  const { addItem } = useCart();
  return (
    <button
      style={{ background: PINK }}
      className="w-full text-white text-xs font-bold rounded-full px-4 py-2 hover:opacity-90 transition"
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        if (product) addItem(product);
      }}
    >
      Adicionar ao carrinho
    </button>
  );
}

export default function Produtos() {
  const { data } = useSite();
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  const categories = ["Todos", ...Array.from(new Set(
    data.products.map(p => p.categoryLabel).filter(Boolean)
  ))];

  const filtered = data.products.filter(p => {
    const matchCat = activeCategory === "Todos"
      || p.categoryLabel === activeCategory
      || (p.extraCategories || []).some(e => e.toLowerCase() === activeCategory.toLowerCase());
    const q = search.toLowerCase();
    const matchSearch = !q
      || p.name.toLowerCase().includes(q)
      || (p.categoryLabel || "").toLowerCase().includes(q)
      || (p.description || "").toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <SharedHeader activePage="produtos" />

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
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5 bg-gray-50 w-full md:w-56 focus-within:border-pink-300 focus-within:bg-white transition">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              className="bg-transparent text-sm outline-none w-full text-gray-700"
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="flex-shrink-0 text-gray-400 hover:text-gray-600">✕</button>
            )}
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-gray-400 mb-5">
          {filtered.length} produto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-semibold">Nenhum produto encontrado</p>
            <p className="text-sm mt-1">Tente outra categoria ou busca</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("Todos"); }}
              style={{ background: PINK }}
              className="mt-5 text-white text-sm font-bold rounded-full px-6 py-2.5 hover:opacity-90 transition">
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((p) => (
              <Link key={p.id} href={`/produto/${p.id}`}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col block group">
                <div className="relative">
                  {p.badge && (
                    <span className="absolute top-2 left-2 z-10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: p.outOfStock ? "#9ca3af" : PINK }}>
                      {p.outOfStock ? "Esgotado" : p.badge}
                    </span>
                  )}
                  <FavBtn productId={p.id} />
                  <div className="flex items-center justify-center" style={{ height: 150, background: `linear-gradient(145deg, ${p.color}15, ${p.color}30)` }}>
                    <img
                      src={p.img.startsWith("http") ? p.img : `${import.meta.env.BASE_URL}${p.img}`}
                      alt={p.name}
                      style={{ height: 130, width: "auto", objectFit: "contain" }}
                      className={p.outOfStock ? "opacity-60 grayscale" : ""}
                    />
                  </div>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <p className="font-bold text-xs text-gray-800 leading-tight mb-0.5">{p.name}</p>
                  <p className="text-[11px] text-gray-400 mb-1">{p.ml}</p>
                  <Stars n={p.stars} size={11} />
                  {p.old && <p className="text-[10px] text-gray-400 line-through mt-1">{p.old}</p>}
                  <p className="font-black text-sm mb-3" style={{ color: p.outOfStock ? "#9ca3af" : PINK }}>
                    {p.outOfStock ? "Esgotado" : p.price}
                  </p>
                  <div className="mt-auto">
                    {p.outOfStock ? (
                      <button disabled className="w-full text-white text-xs font-bold rounded-full px-4 py-2 cursor-not-allowed opacity-50" style={{ background: "#9ca3af" }}>
                        Indisponível
                      </button>
                    ) : (
                      <BuyBtn product={{ id: p.id, name: p.name, price: p.price, img: p.img, color: p.color }} />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <SharedFooter />
    </div>
  );
}
