import { useState } from "react";
import { Link, useParams } from "wouter";
import { ShoppingCart, Star, Heart, User, Menu, X, ChevronRight, Instagram, Facebook, MessageCircle, Check, Truck, Shield, Zap } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { useCart } from "@/context/CartContext";
import { FavBtn, FavIconBtn } from "@/components/FavBtn";

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


function Header() {
  const [open, setOpen] = useState(false);
  const { data } = useSite();
  const { totalItems, openCart } = useCart();
  const logo = data.settings.logo || "logo-pr.png";
  const logoSrc = logo.startsWith("data:") || logo.startsWith("http") ? logo : `${import.meta.env.BASE_URL}${logo}`;
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/"><img src={logoSrc} alt={data.settings.siteName} className="h-10 w-auto" /></Link>
        </div>
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-pink-600 transition">Início</Link>
          <Link href="/produtos" className="hover:text-pink-600 transition">Produtos</Link>
          <Link href="/#quem-usa" className="hover:text-pink-600 transition">Quem usa</Link>
          <Link href="/#depoimentos" className="hover:text-pink-600 transition">Depoimentos</Link>
          <Link href="/#faq" className="hover:text-pink-600 transition">FAQ</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button className="relative p-1.5" onClick={openCart}>
            <ShoppingCart size={20} className="text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold" style={{ background: PINK }}>
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>
          <button className="p-1.5 hidden md:block"><User size={20} className="text-gray-700" /></button>
          <FavIconBtn />
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
              {instaUrl && <a href={instaUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"><Instagram size={15} /></a>}
              {fbUrl && <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"><Facebook size={15} /></a>}
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"><MessageCircle size={15} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-white/60">Produtos</h4>
            <ul className="space-y-1.5 text-sm text-white/80">
              {productLinks.map(item => (<li key={item.id}><Link href={item.href} className="hover:text-white transition">{item.label}</Link></li>))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-white/60">Empresa</h4>
            <ul className="space-y-1.5 text-sm text-white/80">
              {companyLinks.map(item => (<li key={item.id}><Link href={item.href} className="hover:text-white transition">{item.label}</Link></li>))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-white/60">Suporte</h4>
            <ul className="space-y-1.5 text-sm text-white/80">
              {supportLinks.map(item => (<li key={item.id}><Link href={item.href} className="hover:text-white transition">{item.label}</Link></li>))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="text-white/60 text-xs">{data.settings.footerCopyright}</p>
            <Link href="/admin" className="text-white/30 text-xs hover:text-white/60 transition">Admin</Link>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-white/50 text-xs">Pagamentos:</span>
            {paymentMethods.map(p => (<span key={p} className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded font-medium">{p}</span>))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Produto() {
  const { data } = useSite();
  const { addItem } = useCart();
  const { id } = useParams<{ id: string }>();
  const product = data.products.find(p => p.id === id);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <p className="text-2xl font-black text-gray-800 mb-2">Produto não encontrado</p>
          <p className="text-gray-400 mb-6">O produto que você procura não está disponível.</p>
          <Link href="/produtos">
            <button style={{ background: PINK }} className="text-white font-bold rounded-full px-8 py-3 hover:opacity-90 transition">
              Ver todos os produtos
            </button>
          </Link>
        </div>
        <Footer />
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

  const defaultDescription = product.description ||
    `${product.name} é um produto profissional desenvolvido para oferecer brilho, maciez e saúde para seus fios. Com fórmula exclusiva, proporciona resultado visível desde a primeira aplicação, ideal para uso diário ou tratamentos intensivos.`;

  const outOfStock = product.outOfStock === true;
  const waLink = `https://wa.me/${data.settings.whatsapp}?text=Olá! Tenho interesse no produto: ${product.name}${qty > 1 ? ` (quantidade: ${qty})` : ""}`;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-1 text-xs text-gray-400">
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
            <div className="rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center"
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
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition flex-shrink-0 flex items-center justify-center ${selectedImg === i ? "border-pink-500" : "border-gray-200"}`}
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
                <button disabled
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-black text-lg opacity-50 cursor-not-allowed"
                  style={{ background: "#aaa" }}>
                  <ShoppingCart size={20} />
                  Esgotado
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      for (let i = 0; i < qty; i++) {
                        addItem({ id: product.id, name: product.name, price: product.price, img: product.img, color: product.color });
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-black text-lg transition hover:opacity-90"
                    style={{ background: `linear-gradient(135deg, ${DARK_RED}, ${PINK})` }}>
                    <ShoppingCart size={20} />
                    Adicionar ao carrinho
                  </button>
                  <a href={waLink} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition border-2 hover:bg-pink-50"
                    style={{ borderColor: PINK, color: PINK }}>
                    <MessageCircle size={16} />
                    Comprar pelo WhatsApp
                  </a>
                </>
              )}
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition border-2 hover:bg-pink-50"
                style={{ borderColor: PINK, color: PINK }}>
                <MessageCircle size={16} />
                Tirar dúvidas no WhatsApp
              </a>
            </div>

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
          </div>
        </div>
      </section>

      {/* About product */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-5">Sobre o produto</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{defaultDescription}</p>
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
                <div className="rounded-2xl border border-gray-100 p-5">
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

      <Footer />
    </div>
  );
}
