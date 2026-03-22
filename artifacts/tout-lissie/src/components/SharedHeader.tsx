import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, User, Menu, X, ChevronRight } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { useCart } from "@/context/CartContext";
import { FavIconBtn } from "@/components/FavBtn";

const PINK = "#e8006f";

function imgSrc(v: string) {
  if (!v) return "";
  return v.startsWith("data:") || v.startsWith("http") ? v : `${import.meta.env.BASE_URL}${v}`;
}

function SearchBox({ className }: { className?: string }) {
  const { data } = useSite();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  const results = query.trim().length >= 1
    ? data.products.filter(p => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.categoryLabel || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
        );
      }).slice(0, 6)
    : [];

  const showDropdown = focused && query.trim().length >= 1;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect() {
    setQuery("");
    setFocused(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results.length === 1) {
      navigate(`/produto/${results[0].id}`);
      handleSelect();
    } else if (results.length > 1) {
      navigate(`/produtos`);
      handleSelect();
    }
  }

  return (
    <div ref={wrapRef} className={`relative ${className ?? ""}`}>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5 bg-gray-50 focus-within:border-pink-300 focus-within:bg-white transition">
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          className="bg-transparent text-sm outline-none w-36 text-gray-700 placeholder:text-gray-400"
          placeholder="Buscar produtos..."
          autoComplete="off"
        />
        {query && (
          <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="flex-shrink-0">
            <X size={13} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50" style={{ minWidth: 280, right: 0 }}>
          {results.length === 0 ? (
            <div className="px-4 py-5 text-center text-sm text-gray-400">Nenhum produto encontrado</div>
          ) : (
            <ul>
              {results.map(p => (
                <li key={p.id}>
                  <Link href={`/produto/${p.id}`} onClick={handleSelect}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-pink-50 transition cursor-pointer">
                    <div className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                      style={{ background: `linear-gradient(145deg, ${p.color}20, ${p.color}40)` }}>
                      <img src={imgSrc(p.img)} alt={p.name} className="w-9 h-9 object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 truncate">{p.categoryLabel || p.category}</p>
                    </div>
                    <span className="text-sm font-black flex-shrink-0" style={{ color: PINK }}>{p.price}</span>
                  </Link>
                </li>
              ))}
              {results.length >= 6 && (
                <li>
                  <Link href="/produtos" onClick={handleSelect}
                    className="flex items-center justify-center gap-1 px-4 py-2.5 text-xs font-semibold border-t border-gray-100 hover:bg-gray-50 transition"
                    style={{ color: PINK }}>
                    Ver todos os resultados <ChevronRight size={13} />
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

interface SharedHeaderProps {
  activePage?: "home" | "produtos" | "none";
}

export function SharedHeader({ activePage = "none" }: SharedHeaderProps) {
  const { data } = useSite();
  const { totalItems, openCart } = useCart();
  const [open, setOpen] = useState(false);
  const logo = data.settings.logo || "logo-pr.webp";

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/" className="flex items-center">
            <img src={imgSrc(logo)} alt={data.settings.siteName} className="h-14 w-auto" onError={e => (e.currentTarget.style.display = "none")} />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
          <Link href="/"
            className={`hover:text-pink-600 transition ${activePage === "home" ? "font-bold border-b-2" : ""}`}
            style={activePage === "home" ? { color: PINK, borderColor: PINK, paddingBottom: 2 } : {}}>
            Início
          </Link>
          <Link href="/produtos"
            className={`hover:text-pink-600 transition ${activePage === "produtos" ? "font-bold border-b-2" : ""}`}
            style={activePage === "produtos" ? { color: PINK, borderColor: PINK, paddingBottom: 2 } : {}}>
            Produtos
          </Link>
          <a href="/#quem-usa" className="hover:text-pink-600 transition">Quem usa</a>
          <a href="/#faq" className="hover:text-pink-600 transition">FAQ</a>
        </nav>

        <div className="flex items-center gap-2">
          <SearchBox className="hidden md:block" />
          <button className="relative p-1.5" onClick={openCart}>
            <ShoppingCart size={20} className="text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold" style={{ background: PINK }}>
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>
          <Link href="/perfil" className="p-1.5"><User size={20} className="text-gray-700" /></Link>
          <FavIconBtn />
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-3 text-sm font-medium bg-white">
          <SearchBox className="w-full" />
          <Link href="/" className="py-1 text-gray-700" onClick={() => setOpen(false)}>Início</Link>
          <Link href="/produtos" className="py-1 text-gray-700" onClick={() => setOpen(false)}>Produtos</Link>
          <a href="/#quem-usa" className="py-1 text-gray-700" onClick={() => setOpen(false)}>Quem usa</a>
          <a href="/#faq" className="py-1 text-gray-700" onClick={() => setOpen(false)}>FAQ</a>
        </div>
      )}
    </header>
  );
}
