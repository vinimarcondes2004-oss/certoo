import { ShoppingCart, Star, ChevronRight } from "lucide-react";
import { Link, useParams } from "wouter";
import { useState } from "react";
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

export default function Categoria() {
  const { data } = useSite();
  const { slug } = useParams<{ slug: string }>();

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

  const rawLabel = primaryMatch?.categoryLabel ?? (slug
    ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")
    : "");
  const label = rawLabel;

  return (
    <div className="min-h-screen bg-white">
      <SharedHeader />

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
        <p className="text-white/80 text-sm">
          {products.length} produto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🛍️</p>
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
            {products.map((p) => (
              <Link key={p.id} href={`/produto/${p.id}`}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col block">
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
