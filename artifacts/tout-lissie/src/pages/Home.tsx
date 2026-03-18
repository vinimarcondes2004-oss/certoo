import { useState } from "react";
import { ShoppingCart, Star, ChevronDown, ChevronUp, Search, Heart, User, Menu, X, Instagram, Facebook, MessageCircle } from "lucide-react";

const PINK = "#e84393";
const PINK_LIGHT = "#fce4f0";
const PINK_DARK = "#c2185b";
const RED = "#e53935";

function StarRating({ rating = 5, count }: { rating?: number; count?: number }) {
  return (
    <span className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={13} fill={i <= rating ? "#f5a623" : "none"} stroke={i <= rating ? "#f5a623" : "#ccc"} />
      ))}
      {count && <span className="text-xs text-gray-500 ml-1">({count})</span>}
    </span>
  );
}

function AddToCartBtn({ small }: { small?: boolean }) {
  return (
    <button
      style={{ background: PINK }}
      className={`text-white font-bold rounded-full transition hover:opacity-90 ${small ? "text-xs px-3 py-1.5" : "text-sm px-5 py-2"}`}
    >
      Comprar
    </button>
  );
}

const promoItems = [
  "🌸 Frete grátis acima de R$150",
  "✨ Até 6x sem juros",
  "💖 Troca e devolução grátis",
  "🌸 Frete grátis acima de R$150",
  "✨ Até 6x sem juros",
  "💖 Troca e devolução grátis",
  "🌸 Frete grátis acima de R$150",
  "✨ Até 6x sem juros",
  "💖 Troca e devolução grátis",
];

function TopBar() {
  return (
    <div style={{ background: PINK }} className="overflow-hidden py-2">
      <div className="marquee-inner">
        {[...promoItems, ...promoItems].map((item, i) => (
          <span key={i} className="text-white text-sm font-medium px-8">{item}</span>
        ))}
      </div>
    </div>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="flex flex-col leading-tight">
            <span style={{ color: PINK }} className="font-black text-2xl tracking-tight">Tout</span>
            <span className="text-xs text-gray-400 -mt-1 font-medium tracking-widest uppercase">Lissie</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <a href="#" className="hover:text-pink-500 transition">Início</a>
          <a href="#produtos" className="hover:text-pink-500 transition">Produtos</a>
          <a href="#quem-usa" className="hover:text-pink-500 transition">Quem usa</a>
          <a href="#depoimentos" className="hover:text-pink-500 transition">Depoimentos</a>
          <a href="#faq" className="hover:text-pink-500 transition">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center border border-gray-200 rounded-full px-3 py-1.5 gap-2 bg-gray-50">
            <Search size={15} className="text-gray-400" />
            <input placeholder="Buscar produtos..." className="bg-transparent text-sm outline-none w-36" />
          </div>
          <button className="relative p-1.5">
            <ShoppingCart size={22} className="text-gray-700" />
            <span style={{ background: PINK }} className="absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">0</span>
          </button>
          <button className="p-1.5"><User size={22} className="text-gray-700" /></button>
          <button className="p-1.5"><Heart size={22} className="text-gray-700" /></button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-3 text-sm font-medium">
          <a href="#">Início</a>
          <a href="#produtos">Produtos</a>
          <a href="#quem-usa">Quem usa</a>
          <a href="#depoimentos">Depoimentos</a>
          <a href="#faq">FAQ</a>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #e84393 0%, #ff6b9d 40%, #fce4f0 100%)",
        minHeight: 420,
      }}
      className="relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <p style={{ color: "rgba(255,255,255,0.85)" }} className="text-sm font-semibold uppercase tracking-widest mb-2">
            Perfeito para
          </p>
          <h1 className="text-white font-black text-4xl md:text-5xl lg:text-6xl leading-tight mb-4">
            todas as horas<br />do seu dia
          </h1>
          <p className="text-white/80 text-base mb-6 max-w-md">
            Descubra a linha completa de cuidados para cabelos que vai transformar sua rotina de beleza.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <a href="#produtos">
              <button className="bg-white font-bold rounded-full px-8 py-3 text-base transition hover:bg-pink-50" style={{ color: PINK }}>
                APROVEITE AGORA!
              </button>
            </a>
          </div>
          <div className="flex gap-4 mt-6 justify-center md:justify-start">
            {["Shampoo", "Condicionador", "Hidratação", "Finalização"].map(tag => (
              <span key={tag} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="relative">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="grid grid-cols-3 gap-3 p-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-16 h-20 bg-white/30 rounded-xl backdrop-blur-sm border border-white/40 flex items-center justify-center">
                    <div className="w-6 h-12 rounded-full" style={{ background: i % 2 === 0 ? "white" : "rgba(255,255,255,0.5)" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const categories = [
  { name: "Shampoo", icon: "🧴" },
  { name: "Condicionador", icon: "💧" },
  { name: "Máscara", icon: "🌸" },
  { name: "Finalizador", icon: "✨" },
  { name: "Óleo", icon: "💎" },
  { name: "Protetor", icon: "🛡️" },
];

function CategoryBar() {
  return (
    <div className="bg-white border-b border-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.name}
            className="flex flex-col items-center gap-1.5 min-w-[70px] group"
          >
            <div
              style={{ background: PINK_LIGHT }}
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition"
            >
              {cat.icon}
            </div>
            <span className="text-xs font-medium text-gray-600 group-hover:text-pink-500 transition whitespace-nowrap">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

const bestSellers = [
  {
    name: "Shampoo Magic Liss",
    subtitle: "300ml",
    price: "R$ 49,90",
    originalPrice: "R$ 69,90",
    rating: 5,
    reviews: 234,
    badge: "Mais Vendido",
    bgColor: "#fff0f7",
    bottleColor: "#e84393",
  },
  {
    name: "Condicionador Brilho",
    subtitle: "300ml",
    price: "R$ 44,90",
    originalPrice: "R$ 59,90",
    rating: 5,
    reviews: 189,
    badge: "Top",
    bgColor: "#f0f7ff",
    bottleColor: "#4a90e2",
  },
  {
    name: "Máscara Hidratação",
    subtitle: "250g",
    price: "R$ 59,90",
    originalPrice: "R$ 79,90",
    rating: 5,
    reviews: 312,
    badge: "Favorito",
    bgColor: "#fff7f0",
    bottleColor: "#ff9800",
  },
  {
    name: "Óleo Reparador",
    subtitle: "50ml",
    price: "R$ 39,90",
    originalPrice: "R$ 54,90",
    rating: 4,
    reviews: 156,
    badge: "Novo",
    bgColor: "#f0fff4",
    bottleColor: "#4caf50",
  },
  {
    name: "Finalizador Liss",
    subtitle: "200ml",
    price: "R$ 54,90",
    originalPrice: "R$ 74,90",
    rating: 5,
    reviews: 278,
    badge: "Destaque",
    bgColor: "#fdf0ff",
    bottleColor: "#9c27b0",
  },
];

function ProductCard({ product }: { product: typeof bestSellers[0] }) {
  return (
    <div className="product-card flex flex-col min-w-[200px] w-[200px]">
      <div className="relative" style={{ background: product.bgColor }}>
        <div className="absolute top-2 left-2 z-10">
          <span style={{ background: PINK }} className="text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {product.badge}
          </span>
        </div>
        <div className="h-44 flex items-center justify-center p-4">
          <div className="relative">
            <div
              className="w-16 h-28 rounded-full shadow-lg"
              style={{ background: `linear-gradient(180deg, ${product.bottleColor}dd 0%, ${product.bottleColor} 100%)` }}
            />
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-4 rounded-t-full bg-white/40" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/20 rounded-sm" />
          </div>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-sm text-gray-800 mb-0.5">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-1">{product.subtitle}</p>
        <StarRating rating={product.rating} count={product.reviews} />
        <div className="mt-2 mb-3">
          <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
          <p className="font-black text-base" style={{ color: PINK }}>{product.price}</p>
        </div>
        <AddToCartBtn small />
      </div>
    </div>
  );
}

function BestSellersSection() {
  return (
    <section id="produtos" className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Mais Vendidos</h2>
          <a href="#" style={{ color: PINK }} className="text-sm font-semibold hover:underline">Ver todos →</a>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
          {bestSellers.map((p, i) => <ProductCard key={i} product={p} />)}
        </div>
      </div>
    </section>
  );
}

const testimonialImages = [
  { bg: "#fce4f0", emoji: "👩🏻‍🦱" },
  { bg: "#e8f5e9", emoji: "👩🏾‍🦳" },
  { bg: "#e3f2fd", emoji: "👩🏽‍🦰" },
  { bg: "#fff3e0", emoji: "👩🏼‍🦲" },
  { bg: "#f3e5f5", emoji: "👩🏻‍🦳" },
];

function WhoRecommendsSection() {
  return (
    <section id="depoimentos" className="py-10" style={{ background: PINK_LIGHT }}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">Quem usa Tout recomenda</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {testimonialImages.map((img, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden aspect-square flex items-center justify-center text-6xl shadow-sm"
              style={{ background: img.bg }}
            >
              {img.emoji}
            </div>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Juliana M.", city: "São Paulo", text: "Meu cabelo nunca ficou tão liso e brilhoso! Amei demais o shampoo Tout.", stars: 5 },
            { name: "Carla R.", city: "Rio de Janeiro", text: "Produto incrível! A máscara de hidratação transformou completamente meu cabelo.", stars: 5 },
            { name: "Ana Paula S.", city: "Belo Horizonte", text: "Recomendo para todas! O finalizador é maravilhoso, deixa o cabelo perfeito.", stars: 5 },
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
              <StarRating rating={t.stars} />
              <p className="text-sm text-gray-700 mt-2 mb-3 italic">"{t.text}"</p>
              <p className="font-bold text-sm text-gray-800">{t.name}</p>
              <p className="text-xs text-gray-400">{t.city}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EleganceBanner() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b3d 50%, #3d0a2e 100%)",
        minHeight: 280,
      }}
      className="relative overflow-hidden py-16"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{ background: PINK, filter: "blur(60px)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full" style={{ background: "#9c27b0", filter: "blur(50px)" }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8 relative z-10">
        <div className="flex-1 text-center md:text-left">
          <p style={{ color: PINK }} className="text-sm font-semibold uppercase tracking-widest mb-2">A elegância que</p>
          <h2 className="text-white font-black text-4xl md:text-5xl leading-tight mb-4">
            seus fios <span style={{ color: PINK }}>merecem</span>
          </h2>
          <p className="text-white/70 text-base mb-6">
            Cabelos lindos • Fios saudáveis • Resultado garantido
          </p>
          <button style={{ background: PINK }} className="text-white font-bold rounded-full px-8 py-3 text-base hover:opacity-90 transition">
            Descubra Agora
          </button>
        </div>
        <div className="flex gap-4 justify-center">
          {[PINK, "#9c27b0", RED].map((c, i) => (
            <div key={i} className="w-20 h-36 rounded-full shadow-2xl border-2 border-white/20 flex items-end justify-center pb-3"
              style={{ background: `linear-gradient(180deg, ${c}88 0%, ${c} 100%)` }}>
              <span className="text-white/60 text-xs">Tout</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const finalizadores = [
  { name: "Sérum Liss Pro", price: "R$ 64,90", rating: 5, reviews: 198, color: "#e84393" },
  { name: "Spray Protetor", price: "R$ 38,90", rating: 5, reviews: 145, color: "#2196f3" },
  { name: "Creme Finalizador", price: "R$ 52,90", rating: 5, reviews: 221, color: "#ff6b6b" },
  { name: "Óleo Argan", price: "R$ 45,90", rating: 4, reviews: 167, color: "#ff9800" },
];

function FinalizadoresSection() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Finalizadores</h2>
          <a href="#" style={{ color: PINK }} className="text-sm font-semibold hover:underline">Ver todos →</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {finalizadores.map((p, i) => (
            <div key={i} className="product-card">
              <div className="h-40 flex items-center justify-center" style={{ background: `${p.color}15` }}>
                <div className="w-14 h-24 rounded-xl shadow-md flex items-center justify-center"
                  style={{ background: `linear-gradient(180deg, ${p.color}99 0%, ${p.color} 100%)` }}>
                  <div className="w-8 h-10 bg-white/20 rounded-lg" />
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm text-gray-800 mb-1">{p.name}</h3>
                <StarRating rating={p.rating} count={p.reviews} />
                <p className="font-black text-base mt-2 mb-3" style={{ color: PINK }}>{p.price}</p>
                <AddToCartBtn small />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MagicResultSection() {
  return (
    <section className="py-12" style={{ background: "#fafafa" }}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">Resultado Magic ✨</h2>
        <p className="text-center text-gray-500 -mt-3 mb-8 text-sm">Veja a transformação real dos nossos clientes</p>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-64 h-80 rounded-3xl overflow-hidden shadow-xl" style={{ background: "linear-gradient(135deg, #fce4f0 0%, #e84393 100%)" }}>
                <div className="w-full h-full flex items-center justify-center text-8xl">👩🏾‍🦱</div>
              </div>
              <div style={{ background: PINK }} className="absolute -bottom-4 -right-4 text-white rounded-2xl px-4 py-2 shadow-lg">
                <p className="font-black text-lg">100%</p>
                <p className="text-xs">Aprovação</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="space-y-4">
              {[
                { label: "Maciez", value: 98 },
                { label: "Brilho", value: 95 },
                { label: "Hidratação", value: 99 },
                { label: "Redução do frizz", value: 97 },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{item.label}</span>
                    <span className="font-bold" style={{ color: PINK }}>{item.value}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${item.value}%`, background: `linear-gradient(90deg, #e84393, #ff6b9d)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button style={{ background: PINK }} className="text-white font-bold rounded-full px-8 py-3 hover:opacity-90 transition">
                Quero esse resultado!
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const reviews = [
  {
    name: "Fernanda K.",
    avatar: "👩🏻",
    stars: 5,
    text: "Incrível! Meu cabelo ficou liso, brilhoso e saudável. Jamais vou trocar por outra marca!",
    product: "Shampoo Magic Liss",
    date: "15 mar 2026",
  },
  {
    name: "Beatriz S.",
    avatar: "👩🏽",
    stars: 5,
    text: "A máscara de hidratação é um milagre! Nunca vi resultado tão rápido e duradouro.",
    product: "Máscara Hidratação",
    date: "12 mar 2026",
  },
  {
    name: "Priscila A.",
    avatar: "👩🏾",
    stars: 5,
    text: "Amei demais! O finalizador deixa o cabelo com um brilho e uma leveza incomparáveis.",
    product: "Finalizador Liss",
    date: "10 mar 2026",
  },
  {
    name: "Renata M.",
    avatar: "👩🏼",
    stars: 5,
    text: "Recomendo 100%! Uso toda a linha e meu cabelo nunca esteve tão saudável e bonito.",
    product: "Linha Completa",
    date: "8 mar 2026",
  },
];

function WhoUsesSection() {
  return (
    <section id="quem-usa" className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">Quem usa Tout recomenda! 💖</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((r, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{r.avatar}</span>
                <div>
                  <p className="font-bold text-sm text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
              </div>
              <StarRating rating={r.stars} />
              <p className="text-sm text-gray-600 mt-2 mb-3 leading-relaxed">"{r.text}"</p>
              <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: PINK_LIGHT, color: PINK }}>
                {r.product}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const departments = [
  { name: "Shampoos", icon: "🧴", count: 12 },
  { name: "Condicionadores", icon: "💧", count: 8 },
  { name: "Máscaras", icon: "🌸", count: 10 },
  { name: "Finalizadores", icon: "✨", count: 15 },
  { name: "Óleos", icon: "💎", count: 6 },
  { name: "Protetores", icon: "🛡️", count: 9 },
  { name: "Kits", icon: "🎁", count: 5 },
  { name: "Acessórios", icon: "💫", count: 7 },
];

function DepartmentsSection() {
  return (
    <section className="py-10" style={{ background: PINK_LIGHT }}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">Departamentos 💅</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {departments.map(dep => (
            <button key={dep.name} className="flex flex-col items-center gap-2 group">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition group-hover:scale-110 shadow-sm"
                style={{ background: "white" }}
              >
                {dep.icon}
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-pink-500 transition text-center">
                {dep.name}
              </span>
              <span className="text-xs text-gray-400">{dep.count} itens</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ToutLissieSalons() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">Tout Lissie a queridinha dos salões 💕</h2>
        <div className="flex flex-col md:flex-row items-center gap-8 mt-6">
          <div className="flex-1">
            <p className="text-gray-600 leading-relaxed mb-4">
              Profissionais de beleza de todo o Brasil escolhem a linha Tout Lissie para oferecer o melhor tratamento para seus clientes. Com fórmulas desenvolvidas por especialistas, nossa linha proporciona resultados visíveis desde a primeira aplicação.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { value: "500+", label: "Salões parceiros" },
                { value: "50k+", label: "Clientes felizes" },
                { value: "4.9★", label: "Avaliação média" },
              ].map(stat => (
                <div key={stat.label} className="text-center p-3 rounded-xl" style={{ background: PINK_LIGHT }}>
                  <p className="font-black text-2xl" style={{ color: PINK }}>{stat.value}</p>
                  <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <button style={{ background: PINK }} className="text-white font-bold rounded-full px-8 py-3 hover:opacity-90 transition">
              Seja um parceiro
            </button>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-3">
              {[
                { bg: "#fce4f0", emoji: "💆🏽‍♀️" },
                { bg: "#e3f2fd", emoji: "💇🏻‍♀️" },
                { bg: "#e8f5e9", emoji: "💅🏾" },
                { bg: "#fff3e0", emoji: "🪄" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl aspect-square flex items-center justify-center text-5xl shadow-sm"
                  style={{ background: item.bg }}
                >
                  {item.emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "Como usar o shampoo Tout Lissie?",
    a: "Aplique sobre os cabelos molhados, massageie suavemente o couro cabeludo por 2 a 3 minutos e enxágue bem. Para melhores resultados, use em conjunto com o condicionador da linha.",
  },
  {
    q: "Os produtos são indicados para todos os tipos de cabelo?",
    a: "Sim! Toda a linha Tout Lissie foi desenvolvida para atender todos os tipos de cabelo — liso, ondulado, cacheado e crespo — com fórmulas específicas para cada necessidade.",
  },
  {
    q: "Qual o prazo de entrega?",
    a: "O prazo de entrega varia conforme a sua localização. Em geral, entregamos em 2 a 7 dias úteis para todo o Brasil. Pedidos acima de R$150 têm frete grátis.",
  },
  {
    q: "Posso trocar ou devolver um produto?",
    a: "Sim! Oferecemos 30 dias para troca ou devolução sem complicação. Nossa política garante sua satisfação total ou seu dinheiro de volta.",
  },
  {
    q: "Os produtos são testados em animais?",
    a: "Não! Somos 100% cruelty-free. Todos os nossos produtos são desenvolvidos sem testes em animais e utilizamos ingredientes de origem sustentável.",
  },
  {
    q: "Como faço para acompanhar meu pedido?",
    a: "Após a confirmação do pagamento, você receberá um e-mail com o código de rastreamento. Você pode acompanhar sua entrega diretamente pelo nosso site ou pelos Correios.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-12" style={{ background: "#fafafa" }}>
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="section-title">FAQ</h2>
        <p className="text-center text-gray-500 -mt-3 mb-8 text-sm">Perguntas frequentes</p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-gray-800 text-sm">{faq.q}</span>
                {open === i ? (
                  <ChevronUp size={18} style={{ color: PINK }} className="flex-shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                )}
              </button>
              {open === i && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section style={{ background: PINK }} className="py-10">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-white font-black text-2xl mb-2">Receba ofertas exclusivas!</h2>
        <p className="text-white/80 text-sm mb-6">Cadastre seu e-mail e ganhe 10% de desconto na primeira compra</p>
        <div className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            className="flex-1 rounded-full px-4 py-3 text-sm outline-none border-2 border-white/30 bg-white/20 text-white placeholder-white/60 focus:border-white transition"
          />
          <button className="bg-white font-bold rounded-full px-6 py-3 text-sm hover:bg-pink-50 transition" style={{ color: PINK }}>
            Quero!
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="mb-4">
              <span style={{ color: PINK }} className="font-black text-2xl">Tout</span>
              <span className="text-gray-400 text-xs ml-1 uppercase tracking-widest">Lissie</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              A marca favorita de quem cuida do cabelo com amor e dedicação.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: MessageCircle, label: "WhatsApp" },
              ].map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-500 transition">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-300">Produtos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {["Shampoos", "Condicionadores", "Máscaras", "Finalizadores", "Óleos", "Kits"].map(item => (
                <li key={item}><a href="#" className="hover:text-pink-400 transition">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-300">Empresa</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {["Sobre nós", "Blog", "Parceiros", "Trabalhe conosco", "Imprensa"].map(item => (
                <li key={item}><a href="#" className="hover:text-pink-400 transition">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-300">Suporte</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {["Central de ajuda", "Trocas e devoluções", "Rastrear pedido", "Política de privacidade", "Termos de uso"].map(item => (
                <li key={item}><a href="#" className="hover:text-pink-400 transition">{item}</a></li>
              ))}
            </ul>
            <div className="mt-4 p-3 rounded-xl bg-gray-800">
              <p className="text-xs text-gray-400 mb-1">Atendimento</p>
              <p className="text-sm font-semibold text-white">seg-sex, 8h-18h</p>
              <p className="text-sm text-pink-400">contato@toutlissie.com.br</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            © 2026 Tout Lissie. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-xs">Pagamentos seguros:</span>
            {["Visa", "Master", "Pix", "Boleto"].map(p => (
              <span key={p} className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-md font-medium">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <HeroSection />
      <CategoryBar />
      <BestSellersSection />
      <WhoRecommendsSection />
      <EleganceBanner />
      <FinalizadoresSection />
      <MagicResultSection />
      <WhoUsesSection />
      <DepartmentsSection />
      <ToutLissieSalons />
      <FAQSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
