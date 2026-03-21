import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "wouter";
import {
  LayoutDashboard, Package, Image, MessageSquare, Settings,
  Plus, Pencil, Trash2, Save, X, Eye, Star, Lock, LogOut, ChevronLeft,
  Upload, FileText, ArrowUp, ArrowDown, Layers, EyeOff, Library, RefreshCw,
  Copy, Check, Video, ImageIcon, Grid2x2
} from "lucide-react";
import { useSite } from "@/context/SiteContext";
import {
  getAdminPassword, setAdminPassword, generateId,
  getAdminEmail, setAdminEmail, getUsers, saveUsers, UserAccount,
  Product, Review, FaqItem, MosaicPhoto, CategoryCard, FooterLink, AboutValue,
  SectionConfig, DEFAULT_SECTION_LAYOUT, CustomSection,
} from "@/lib/siteData";

const PINK = "#e8006f";

/* ─── LOGIN ─── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const adminEmail = getAdminEmail();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pwOk = pw === getAdminPassword();
    const emailOk = !adminEmail || email.toLowerCase().trim() === adminEmail.toLowerCase().trim();
    if (pwOk && emailOk) {
      sessionStorage.setItem("admin_auth", "1");
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#fdf0f6" }}>
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: PINK }}>
          <Lock size={28} className="text-white" />
        </div>
        <h1 className="font-black text-2xl text-gray-900 mb-1">Área Admin</h1>
        <p className="text-gray-400 text-sm mb-7">PR Profissional</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {adminEmail && (
            <input type="email" placeholder="E-mail do admin" value={email}
              onChange={e => setEmail(e.target.value)}
              className={`w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition ${error ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-pink-400"}`} />
          )}
          <input type="password" placeholder="Senha" value={pw}
            onChange={e => setPw(e.target.value)}
            className={`w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition ${error ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-pink-400"}`} />
          {error && <p className="text-red-500 text-xs">E-mail ou senha incorretos</p>}
          <button type="submit" className="w-full text-white font-bold rounded-xl py-3 text-sm transition hover:opacity-90" style={{ background: PINK }}>
            Entrar
          </button>
        </form>
        <Link href="/">
          <button className="mt-4 text-gray-400 text-xs hover:text-gray-600 transition flex items-center gap-1 mx-auto">
            <ChevronLeft size={13} /> Voltar ao site
          </button>
        </Link>
      </div>
    </div>
  );
}

/* ─── HELPERS ─── */
function StarsInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button" onClick={() => onChange(i)}>
          <Star size={18} fill={i <= value ? "#f5a623" : "none"} stroke={i <= value ? "#f5a623" : "#ddd"} />
        </button>
      ))}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-400 transition";
const textareaCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-400 transition resize-none";

function imgSrc(v: string) {
  if (!v) return "";
  return v.startsWith("data:") || v.startsWith("http") ? v : `${import.meta.env.BASE_URL}${v}`;
}

function ImagePicker({ value, onChange, label = "Imagem" }: { value: string; onChange: (v: string) => void; label?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (ev) => { onChange(ev.target?.result as string); setLoading(false); };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, [onChange]);
  const preview = value ? imgSrc(value) : null;
  return (
    <Field label={label}>
      <div className="space-y-2">
        <div className="flex gap-2">
          <input className={inputCls + " flex-1"}
            value={value.startsWith("data:") ? "(imagem enviada)" : value}
            onChange={e => onChange(e.target.value)}
            placeholder="nome-do-arquivo.png ou URL"
            readOnly={value.startsWith("data:")} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-dashed border-gray-300 text-sm font-semibold text-gray-500 hover:border-pink-400 hover:text-pink-500 transition whitespace-nowrap">
            {loading ? <span className="animate-spin text-xs">⏳</span> : <Upload size={14} />}
            {loading ? "Carregando..." : "Escolher arquivo"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
        {preview && (
          <div className="rounded-xl overflow-hidden border border-gray-100 h-28 flex items-center justify-center bg-gray-50 relative">
            <img src={preview} alt="" className="h-24 object-contain" onError={e => (e.currentTarget.style.display = "none")} />
            {value.startsWith("data:") && (
              <button type="button" onClick={() => onChange("")}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-400 text-white flex items-center justify-center hover:bg-red-500 transition">
                <X size={10} />
              </button>
            )}
          </div>
        )}
      </div>
    </Field>
  );
}

/* ─── VIDEO PICKER ─── */
function VideoPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">(value.startsWith("data:") ? "upload" : "url");

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (ev) => { onChange(ev.target?.result as string); setLoading(false); };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, [onChange]);

  return (
    <Field label="Vídeo">
      <div className="flex gap-2 mb-3">
        {(["upload", "url"] as const).map(m => (
          <button key={m} type="button"
            onClick={() => { setMode(m); if (m !== mode) onChange(""); }}
            className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition ${mode === m ? "text-white border-transparent" : "border-gray-200 text-gray-500"}`}
            style={mode === m ? { background: PINK } : {}}>
            {m === "upload" ? "⬆️ Enviar arquivo" : "🔗 URL (YouTube / .mp4)"}
          </button>
        ))}
      </div>

      {mode === "upload" ? (
        <div className="space-y-2">
          <button type="button" onClick={() => fileRef.current?.click()} disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed border-gray-300 text-sm font-semibold text-gray-500 hover:border-pink-400 hover:text-pink-500 transition">
            {loading ? <span className="animate-spin text-xs">⏳</span> : <Upload size={15} />}
            {loading ? "Enviando..." : value.startsWith("data:video") ? "Substituir vídeo" : "Escolher arquivo de vídeo"}
          </button>
          <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFile} />
          {value.startsWith("data:video") && (
            <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 relative">
              <video src={value} className="w-full max-h-40 object-contain" controls playsInline />
              <button type="button" onClick={() => onChange("")}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-400 text-white flex items-center justify-center hover:bg-red-500 transition">
                <X size={10} />
              </button>
            </div>
          )}
          <p className="text-xs text-gray-400">Formatos: MP4, WebM, MOV. Tamanho máximo recomendado: 50 MB.</p>
        </div>
      ) : (
        <div className="space-y-1">
          <input className={inputCls} value={value.startsWith("data:") ? "" : value}
            onChange={e => onChange(e.target.value)}
            placeholder="https://youtube.com/watch?v=... ou URL do .mp4" />
          <p className="text-xs text-gray-400">Cole o link do YouTube ou um link direto de vídeo (.mp4).</p>
        </div>
      )}
    </Field>
  );
}

/* ─── SECTION HEADER ─── */
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h3 className="font-black text-base text-gray-800">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

/* ─── PRODUCTS TAB ─── */
function ProductsTab() {
  const { data, updateData } = useSite();
  const [editing, setEditing] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);
  const blank: Product = { id: "", name: "", ml: "", price: "", old: "", stars: 5, badge: "", img: "", category: "", categoryLabel: "", color: PINK, extraCategories: [], showInBestSellers: true, outOfStock: false, description: "", benefits: [], howToUse: "", ingredients: "", delivery: "", seals: [] };
  function startAdd() { setEditing({ ...blank, id: generateId() }); setAdding(true); }
  function startEdit(p: Product) { setEditing({ ...p }); setAdding(false); }
  function cancel() { setEditing(null); }
  function save() {
    if (!editing) return;
    updateData({ products: adding ? [...data.products, editing] : data.products.map(p => p.id === editing.id ? editing : p) });
    setEditing(null);
  }
  function remove(id: string) {
    if (!confirm("Remover este produto?")) return;
    updateData({ products: data.products.filter(p => p.id !== id) });
  }
  if (editing) return (
    <div className="max-w-xl">
      <h3 className="font-black text-lg text-gray-800 mb-6">{adding ? "Novo Produto" : "Editar Produto"}</h3>
      <div className="space-y-4">
        <Field label="Nome"><input className={inputCls} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Volume/Tamanho"><input className={inputCls} value={editing.ml} onChange={e => setEditing({ ...editing, ml: e.target.value })} placeholder="300ml" /></Field>
          <Field label="Badge"><input className={inputCls} value={editing.badge} onChange={e => setEditing({ ...editing, badge: e.target.value })} placeholder="Mais Vendido" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Preço"><input className={inputCls} value={editing.price} onChange={e => setEditing({ ...editing, price: e.target.value })} placeholder="R$ 80,00" /></Field>
          <Field label="Preço antigo"><input className={inputCls} value={editing.old} onChange={e => setEditing({ ...editing, old: e.target.value })} placeholder="R$ 120,00" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Categoria (slug)"><input className={inputCls} value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} placeholder="shampoo-e-mascara" /></Field>
          <Field label="Categoria (label)"><input className={inputCls} value={editing.categoryLabel} onChange={e => setEditing({ ...editing, categoryLabel: e.target.value })} placeholder="Shampoos" /></Field>
        </div>
        {/* ─── Visibilidade ─── */}
        <div className="rounded-xl border border-gray-200 p-4 space-y-4">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Onde este produto aparece?</p>

          {/* Seções da página principal */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase mb-2">Status do produto</p>
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox"
                  checked={editing.outOfStock === true}
                  onChange={e => setEditing({ ...editing, outOfStock: e.target.checked })}
                  className="w-4 h-4 rounded accent-pink-500" />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Produto esgotado</span>
              </label>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase mb-2">Seções da página principal</p>
            <div className="space-y-2">
              {/* Mais Vendidos */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox"
                  checked={editing.showInBestSellers !== false}
                  onChange={e => setEditing({ ...editing, showInBestSellers: e.target.checked })}
                  className="w-4 h-4 rounded accent-pink-500" />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Mais Vendidos</span>
              </label>
              {/* Seção Kits (featured) */}

              {(() => {
                const featCat = (data.sectionTitles.featuredCategory || "kits").toLowerCase();
                const featTitle = data.sectionTitles.featuredTitle || "Kits";
                const extras = editing.extraCategories || [];
                const inFeat = extras.includes(featCat) || (editing.categoryLabel || "").toLowerCase() === featCat || (editing.category || "").toLowerCase() === featCat;
                return (
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox"
                      checked={inFeat}
                      onChange={e => {
                        const base = extras.filter(x => x !== featCat);
                        setEditing({ ...editing, extraCategories: e.target.checked ? [...base, featCat] : base });
                      }}
                      className="w-4 h-4 rounded accent-pink-500" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">Seção "{featTitle}"</span>
                  </label>
                );
              })()}
            </div>
          </div>

          {/* Abas da página Produtos */}
          {(() => {
            const allLabels = Array.from(new Set(
              data.products.map(p => p.categoryLabel).filter(Boolean)
            ));
            if (allLabels.length === 0) return null;
            return (
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase mb-2">Abas da página Produtos</p>
                <div className="space-y-2">
                  {allLabels.map(label => {
                    const isMain = (editing.categoryLabel || "") === label;
                    const extras = editing.extraCategories || [];
                    const inExtra = extras.some(e => e.toLowerCase() === label.toLowerCase());
                    const checked = isMain || inExtra;
                    return (
                      <label key={label} className={`flex items-center gap-2.5 ${isMain ? "opacity-70" : "cursor-pointer group"}`}>
                        <input type="checkbox"
                          checked={checked}
                          disabled={isMain}
                          onChange={e => {
                            if (isMain) return;
                            const base = extras.filter(x => x.toLowerCase() !== label.toLowerCase());
                            setEditing({ ...editing, extraCategories: e.target.checked ? [...base, label.toLowerCase()] : base });
                          }}
                          className="w-4 h-4 rounded accent-pink-500" />
                        <span className={`text-sm text-gray-700 ${!isMain && "group-hover:text-gray-900"}`}>
                          {label}
                          {isMain && <span className="ml-1 text-[10px] text-gray-400">(aba principal)</span>}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Páginas de categoria */}
          {data.categoryCards.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase mb-2">Páginas de categoria</p>
              <div className="space-y-2">
                {data.categoryCards.map(card => {
                  const isMain = (editing.category || "").toLowerCase() === card.slug.toLowerCase();
                  const extras = editing.extraCategories || [];
                  const inExtra = extras.map(e => e.toLowerCase()).includes(card.slug.toLowerCase());
                  const checked = isMain || inExtra;
                  return (
                    <label key={card.id} className={`flex items-center gap-2.5 ${isMain ? "opacity-70" : "cursor-pointer group"}`}>
                      <input type="checkbox"
                        checked={checked}
                        disabled={isMain}
                        onChange={e => {
                          if (isMain) return;
                          const base = extras.filter(x => x.toLowerCase() !== card.slug.toLowerCase());
                          setEditing({ ...editing, extraCategories: e.target.checked ? [...base, card.slug] : base });
                        }}
                        className="w-4 h-4 rounded accent-pink-500" />
                      <span className={`text-sm text-gray-700 ${!isMain && "group-hover:text-gray-900"}`}>
                        {card.label}
                        {isMain && <span className="ml-1 text-[10px] text-gray-400">(categoria principal)</span>}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <ImagePicker label="Imagem do produto" value={editing.img} onChange={v => setEditing({ ...editing, img: v })} />
        <Field label="Cor do card (hex)"><input className={inputCls} value={editing.color} onChange={e => setEditing({ ...editing, color: e.target.value })} placeholder="#e8006f" /></Field>
        <Field label="Estrelas"><StarsInput value={editing.stars} onChange={n => setEditing({ ...editing, stars: n })} /></Field>

        {/* ─── Sobre o Produto ─── */}
        <div className="rounded-xl border border-gray-200 p-4 space-y-4">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Sobre o produto</p>
          <Field label="Descrição" hint="Texto principal da seção 'Sobre o produto'">
            <textarea className={textareaCls} rows={4} placeholder="Descreva o produto..." value={editing.description || ""} onChange={e => setEditing({ ...editing, description: e.target.value })} />
          </Field>
          <Field label="Benefícios" hint="Um benefício por linha. Ex: Hidratação profunda">
            <textarea className={textareaCls} rows={4} placeholder={"Hidratação profunda\nBrilho intenso\nReduz frizz"} value={(editing.benefits || []).join("\n")} onChange={e => setEditing({ ...editing, benefits: e.target.value.split("\n") })} />
          </Field>
          <Field label="Como usar">
            <textarea className={textareaCls} rows={3} placeholder="Aplique nos fios molhados, massageie e enxágue." value={editing.howToUse || ""} onChange={e => setEditing({ ...editing, howToUse: e.target.value })} />
          </Field>
          <Field label="Ingredientes">
            <textarea className={textareaCls} rows={3} placeholder="Aqua, Keratin, Panthenol..." value={editing.ingredients || ""} onChange={e => setEditing({ ...editing, ingredients: e.target.value })} />
          </Field>
        </div>

        {/* ─── Entrega e Selos ─── */}
        <div className="rounded-xl border border-gray-200 p-4 space-y-4">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Entrega &amp; Selos</p>
          <Field label="Informações de entrega" hint="Ex: Frete grátis acima de R$150 · Entrega em 2 a 7 dias úteis">
            <input className={inputCls} placeholder="Frete grátis acima de R$150 · Entrega em 2 a 7 dias úteis" value={editing.delivery || ""} onChange={e => setEditing({ ...editing, delivery: e.target.value })} />
          </Field>
          <Field label="Selos / Certificações" hint="Um selo por linha. Ex: Cruelty-free, 100% Vegano, Dermatologicamente testado">
            <textarea className={textareaCls} rows={3} placeholder={"Cruelty-free\n100% Vegano\nDermatologicamente testado"} value={(editing.seals || []).join("\n")} onChange={e => setEditing({ ...editing, seals: e.target.value.split("\n").filter(s => s.trim()) })} />
          </Field>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={save} className="flex-1 text-white font-bold rounded-xl py-2.5 text-sm hover:opacity-90 transition flex items-center justify-center gap-2" style={{ background: PINK }}>
            <Save size={15} /> Salvar
          </button>
          <button onClick={cancel} className="px-5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-lg text-gray-800">Produtos ({data.products.length})</h3>
        <button onClick={startAdd} className="text-white text-sm font-bold rounded-xl px-4 py-2 flex items-center gap-1.5 hover:opacity-90 transition" style={{ background: PINK }}>
          <Plus size={15} /> Adicionar
        </button>
      </div>
      <div className="space-y-3">
        {data.products.map(p => (
          <div key={p.id} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-3 border border-gray-100">
            <img src={imgSrc(p.img)} alt={p.name} className="w-14 h-14 object-contain flex-shrink-0 rounded-lg bg-white" onError={e => (e.currentTarget.style.display = "none")} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-800 truncate">{p.name}</p>
              <p className="text-xs text-gray-400">{p.ml} · {p.categoryLabel}</p>
              <p className="text-xs font-black" style={{ color: PINK }}>{p.price}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-white transition border border-gray-200"><Pencil size={14} className="text-gray-500" /></button>
              <button onClick={() => remove(p.id)} className="p-2 rounded-lg hover:bg-red-50 transition border border-gray-200"><Trash2 size={14} className="text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── HERO TAB ─── */
function HeroTab() {
  const { data, updateData } = useSite();
  const slides = data.heroSlides;
  function update(id: string, field: string, value: string) {
    updateData({ heroSlides: slides.map(s => s.id === id ? { ...s, [field]: value } : s) });
  }
  return (
    <div>
      <h3 className="font-black text-lg text-gray-800 mb-6">Slides do Hero</h3>
      <div className="space-y-5">
        {slides.map((s, i) => (
          <div key={s.id} className="border border-gray-100 rounded-2xl p-5 bg-gray-50">
            <p className="font-bold text-sm text-gray-600 mb-4">Slide {i + 1}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Field label="Subtítulo (pequeno acima)">
                  <input className={inputCls} value={s.subtitle} onChange={e => update(s.id, "subtitle", e.target.value)} />
                </Field>
                <Field label="Título principal">
                  <textarea className={textareaCls} rows={3} value={s.title} onChange={e => update(s.id, "title", e.target.value)} />
                </Field>
                <Field label="Texto do botão">
                  <input className={inputCls} value={s.buttonText} onChange={e => update(s.id, "buttonText", e.target.value)} />
                </Field>
                <ImagePicker label="Imagem de fundo" value={s.img} onChange={v => update(s.id, "img", v)} />
              </div>
              <div className="rounded-xl overflow-hidden bg-gray-200 h-44 flex items-center justify-center relative">
                <img src={imgSrc(s.img)} alt="" className="absolute inset-0 w-full h-full object-cover" onError={e => (e.currentTarget.style.opacity = "0")} />
                <span className="relative z-10 text-white font-bold text-xs bg-black/40 px-3 py-1 rounded-full">Preview</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">As alterações são salvas automaticamente.</p>
    </div>
  );
}

/* ─── REVIEWS TAB ─── */
function ReviewsTab() {
  const { data, updateData } = useSite();
  const [section, setSection] = useState<"reviews" | "salon">("reviews");
  const [editing, setEditing] = useState<Review | null>(null);
  const [adding, setAdding] = useState(false);
  const blank: Review = { id: "", name: "", img: "", stars: 5, text: "", date: "", role: "" };
  const items = section === "reviews" ? data.reviews : data.salonReviews;
  function startAdd() { setEditing({ ...blank, id: generateId() }); setAdding(true); }
  function startEdit(r: Review) { setEditing({ ...r }); setAdding(false); }
  function cancel() { setEditing(null); }
  function save() {
    if (!editing) return;
    const key = section === "reviews" ? "reviews" : "salonReviews";
    const list = data[key] as Review[];
    updateData({ [key]: adding ? [...list, editing] : list.map(r => r.id === editing.id ? editing : r) });
    setEditing(null);
  }
  function remove(id: string) {
    if (!confirm("Remover esta avaliação?")) return;
    const key = section === "reviews" ? "reviews" : "salonReviews";
    updateData({ [key]: (data[key] as Review[]).filter(r => r.id !== id) });
  }
  if (editing) return (
    <div className="max-w-lg">
      <h3 className="font-black text-lg text-gray-800 mb-6">{adding ? "Nova Avaliação" : "Editar Avaliação"}</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nome"><input className={inputCls} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></Field>
          <Field label="Data"><input className={inputCls} value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} placeholder="15 mar 2026" /></Field>
        </div>
        {section === "salon" && (
          <Field label="Cargo / Salão"><input className={inputCls} value={editing.role ?? ""} onChange={e => setEditing({ ...editing, role: e.target.value })} placeholder="Cabeleireira profissional" /></Field>
        )}
        <ImagePicker label="Foto" value={editing.img} onChange={v => setEditing({ ...editing, img: v })} />
        <Field label="Depoimento"><textarea className={textareaCls} rows={3} value={editing.text} onChange={e => setEditing({ ...editing, text: e.target.value })} /></Field>
        <Field label="Estrelas"><StarsInput value={editing.stars} onChange={n => setEditing({ ...editing, stars: n })} /></Field>
        <div className="flex gap-3 pt-2">
          <button onClick={save} className="flex-1 text-white font-bold rounded-xl py-2.5 text-sm hover:opacity-90 transition flex items-center justify-center gap-2" style={{ background: PINK }}>
            <Save size={15} /> Salvar
          </button>
          <button onClick={cancel} className="px-5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <h3 className="font-black text-lg text-gray-800 mb-1">Depoimentos</h3>
      <p className="text-sm text-gray-400 mb-4">Esses depoimentos aparecem na seção "Quem usa" e "Salões" da página inicial.</p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {(["reviews", "salon"] as const).map(s => (
            <button key={s} onClick={() => setSection(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${section === s ? "text-white border-transparent" : "text-gray-500 border-gray-200 bg-white"}`}
              style={section === s ? { background: PINK, borderColor: PINK } : {}}>
              {s === "reviews" ? "💬 Clientes" : "💅 Salões / Profissionais"}
            </button>
          ))}
        </div>
        <button onClick={startAdd} className="text-white text-sm font-bold rounded-xl px-4 py-2 flex items-center gap-1.5 hover:opacity-90 transition" style={{ background: PINK }}>
          <Plus size={15} /> Adicionar
        </button>
      </div>
      <div className="space-y-3">
        {items.map(r => (
          <div key={r.id} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-3 border border-gray-100">
            <img src={imgSrc(r.img)} alt={r.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" onError={e => (e.currentTarget.style.display = "none")} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-800">{r.name} {r.role && <span className="font-normal text-gray-400">· {r.role}</span>}</p>
              <p className="text-xs text-gray-500 truncate">"{r.text}"</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(r)} className="p-2 rounded-lg hover:bg-white transition border border-gray-200"><Pencil size={14} className="text-gray-500" /></button>
              <button onClick={() => remove(r.id)} className="p-2 rounded-lg hover:bg-red-50 transition border border-gray-200"><Trash2 size={14} className="text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── FAQ TAB ─── */
function FaqTab() {
  const { data, updateData } = useSite();
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [adding, setAdding] = useState(false);
  const blank: FaqItem = { id: "", q: "", a: "" };
  function startAdd() { setEditing({ ...blank, id: generateId() }); setAdding(true); }
  function startEdit(f: FaqItem) { setEditing({ ...f }); setAdding(false); }
  function cancel() { setEditing(null); }
  function save() {
    if (!editing) return;
    updateData({ faqs: adding ? [...data.faqs, editing] : data.faqs.map(f => f.id === editing.id ? editing : f) });
    setEditing(null);
  }
  function remove(id: string) {
    if (!confirm("Remover esta pergunta?")) return;
    updateData({ faqs: data.faqs.filter(f => f.id !== id) });
  }
  function moveUp(i: number) {
    if (i === 0) return;
    const arr = [...data.faqs];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    updateData({ faqs: arr });
  }
  if (editing) return (
    <div className="max-w-lg">
      <h3 className="font-black text-lg text-gray-800 mb-6">{adding ? "Nova Pergunta" : "Editar Pergunta"}</h3>
      <div className="space-y-4">
        <Field label="Pergunta"><input className={inputCls} value={editing.q} onChange={e => setEditing({ ...editing, q: e.target.value })} /></Field>
        <Field label="Resposta"><textarea className={textareaCls} rows={4} value={editing.a} onChange={e => setEditing({ ...editing, a: e.target.value })} /></Field>
        <div className="flex gap-3 pt-2">
          <button onClick={save} className="flex-1 text-white font-bold rounded-xl py-2.5 text-sm hover:opacity-90 transition flex items-center justify-center gap-2" style={{ background: PINK }}>
            <Save size={15} /> Salvar
          </button>
          <button onClick={cancel} className="px-5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-lg text-gray-800">FAQ ({data.faqs.length})</h3>
        <button onClick={startAdd} className="text-white text-sm font-bold rounded-xl px-4 py-2 flex items-center gap-1.5 hover:opacity-90 transition" style={{ background: PINK }}>
          <Plus size={15} /> Adicionar
        </button>
      </div>
      <div className="space-y-3">
        {data.faqs.map((f, i) => (
          <div key={f.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-1 mt-0.5">
                <button onClick={() => moveUp(i)} disabled={i === 0} className="text-gray-300 hover:text-gray-500 disabled:opacity-30 text-xs leading-none">▲</button>
                <button onClick={() => moveUp(i + 1)} disabled={i === data.faqs.length - 1} className="text-gray-300 hover:text-gray-500 disabled:opacity-30 text-xs leading-none">▼</button>
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-800 mb-0.5">{f.q}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{f.a}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(f)} className="p-2 rounded-lg hover:bg-white border border-gray-200"><Pencil size={13} className="text-gray-500" /></button>
                <button onClick={() => remove(f.id)} className="p-2 rounded-lg hover:bg-red-50 border border-gray-200"><Trash2 size={13} className="text-red-400" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CONTEÚDO TAB ─── */
function ContentTab() {
  const { data, updateData } = useSite();
  const [section, setSection] = useState<"texts" | "logo" | "elegance" | "resultado" | "mosaic" | "categories" | "sobre" | "footer">("texts");

  const st = data.sectionTitles;
  const eb = data.eleganceBanner;
  const rm = data.resultadoMagic;

  /* Mosaic helpers */
  const [editMosaic, setEditMosaic] = useState<MosaicPhoto | null>(null);
  const [mosaicView, setMosaicView] = useState<"grid" | "list">("grid");
  function saveMosaic() {
    if (!editMosaic) return;
    updateData({ mosaicPhotos: data.mosaicPhotos.map(p => p.id === editMosaic.id ? editMosaic : p) });
    setEditMosaic(null);
  }
  function addMosaic() {
    const newP: MosaicPhoto = { id: generateId(), type: "image", img: "", big: false, aspectRatio: "1/1" };
    updateData({ mosaicPhotos: [...data.mosaicPhotos, newP] });
  }
  function removeMosaic(id: string) {
    if (!confirm("Remover esta foto?")) return;
    updateData({ mosaicPhotos: data.mosaicPhotos.filter(p => p.id !== id) });
  }
  function moveMosaic(i: number, dir: -1 | 1) {
    const arr = [...data.mosaicPhotos];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    updateData({ mosaicPhotos: arr });
  }

  /* Category card helpers */
  const [editCat, setEditCat] = useState<CategoryCard | null>(null);
  function saveCat() {
    if (!editCat) return;
    updateData({ categoryCards: data.categoryCards.map(c => c.id === editCat.id ? editCat : c) });
    setEditCat(null);
  }
  function addCat() {
    const newC: CategoryCard = { id: generateId(), label: "", slug: "", img: "", color: "#fce4ec" };
    updateData({ categoryCards: [...data.categoryCards, newC] });
  }
  function removeCat(id: string) {
    if (!confirm("Remover este card?")) return;
    updateData({ categoryCards: data.categoryCards.filter(c => c.id !== id) });
  }

  /* About values helpers */
  const [editVal, setEditVal] = useState<AboutValue | null>(null);
  function saveVal() {
    if (!editVal) return;
    const sn = data.sobreNos;
    const exists = sn.values.find(v => v.id === editVal.id);
    updateData({ sobreNos: { ...sn, values: exists ? sn.values.map(v => v.id === editVal.id ? editVal : v) : [...sn.values, editVal] } });
    setEditVal(null);
  }
  function removeVal(id: string) {
    if (!confirm("Remover este valor?")) return;
    const sn = data.sobreNos;
    updateData({ sobreNos: { ...sn, values: sn.values.filter(v => v.id !== id) } });
  }

  /* Footer link helpers */
  const [editLink, setEditLink] = useState<FooterLink | null>(null);
  function saveLink() {
    if (!editLink) return;
    const exists = data.footerLinks.find(l => l.id === editLink.id);
    updateData({ footerLinks: exists ? data.footerLinks.map(l => l.id === editLink.id ? editLink : l) : [...data.footerLinks, editLink] });
    setEditLink(null);
  }
  function removeLink(id: string) {
    if (!confirm("Remover este link?")) return;
    updateData({ footerLinks: data.footerLinks.filter(l => l.id !== id) });
  }

  const subTabs = [
    { id: "texts", label: "Textos das seções" },
    { id: "logo", label: "Logo" },
    { id: "elegance", label: "Banner Elegance" },
    { id: "resultado", label: "Antes & Depois" },
    { id: "mosaic", label: "Mosaico de fotos" },
    { id: "categories", label: "Cards de categoria" },
    { id: "sobre", label: "Página Sobre nós" },
    { id: "footer", label: "Links do rodapé" },
  ] as const;

  return (
    <div>
      <h3 className="font-black text-lg text-gray-800 mb-4">Conteúdo do Site</h3>
      {/* Sub-tab pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {subTabs.map(t => (
          <button key={t.id} onClick={() => setSection(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${section === t.id ? "text-white border-transparent" : "text-gray-500 border-gray-200 bg-white hover:bg-gray-50"}`}
            style={section === t.id ? { background: PINK, borderColor: PINK } : {}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TEXTOS DAS SEÇÕES ── */}
      {section === "texts" && (
        <div className="max-w-xl space-y-4">
          <SectionHeader title="Títulos das seções" subtitle="Edite os cabeçalhos exibidos no site" />
          <Field label="Título 'Mais Vendidos'"><input className={inputCls} value={st.bestSellers} onChange={e => updateData({ sectionTitles: { ...st, bestSellers: e.target.value } })} /></Field>
          <Field label="Título 'Quem usa - mosaico'"><input className={inputCls} value={st.whoRecommends} onChange={e => updateData({ sectionTitles: { ...st, whoRecommends: e.target.value } })} /></Field>
          <Field label="Título 'Quem usa - avaliações'"><input className={inputCls} value={st.whoUses} onChange={e => updateData({ sectionTitles: { ...st, whoUses: e.target.value } })} /></Field>
          <Field label="Título 'Salões'"><input className={inputCls} value={st.salonSection} onChange={e => updateData({ sectionTitles: { ...st, salonSection: e.target.value } })} /></Field>
          <Field label="Subtítulo 'Salões'"><input className={inputCls} value={st.salonSubtitle} onChange={e => updateData({ sectionTitles: { ...st, salonSubtitle: e.target.value } })} /></Field>
          <Field label="Título 'Vitrine de Produtos'"><input className={inputCls} value={st.featuredTitle ?? "Finalizadores"} onChange={e => updateData({ sectionTitles: { ...st, featuredTitle: e.target.value } })} /></Field>
          <Field label="Vitrine — Filtrar por categoria (deixe vazio para mostrar todos)"><input className={inputCls} placeholder="ex: finalizadores" value={st.featuredCategory ?? ""} onChange={e => updateData({ sectionTitles: { ...st, featuredCategory: e.target.value } })} /></Field>
          <Field label="Título do FAQ"><input className={inputCls} value={st.faq} onChange={e => updateData({ sectionTitles: { ...st, faq: e.target.value } })} /></Field>
          <Field label="FAQ - Título CTA (card rosa)"><input className={inputCls} value={st.faqCta} onChange={e => updateData({ sectionTitles: { ...st, faqCta: e.target.value } })} /></Field>
          <Field label="FAQ - Subtítulo CTA"><textarea className={textareaCls} rows={2} value={st.faqCtaSubtitle} onChange={e => updateData({ sectionTitles: { ...st, faqCtaSubtitle: e.target.value } })} /></Field>
          <p className="text-xs text-gray-400">Alterações salvas automaticamente.</p>
        </div>
      )}

      {/* ── LOGO ── */}
      {section === "logo" && (
        <div className="max-w-md space-y-4">
          <SectionHeader title="Logo do site" subtitle="Aparece no cabeçalho e rodapé" />
          <ImagePicker label="Arquivo do logo" value={data.settings.logo ?? ""} onChange={v => updateData({ settings: { ...data.settings, logo: v } })} />
          {(data.settings.logo) && (
            <div className="bg-gray-900 rounded-2xl p-6 flex items-center justify-center">
              <img src={imgSrc(data.settings.logo)} alt="Logo preview" className="h-14 w-auto object-contain" onError={e => (e.currentTarget.style.display = "none")} />
            </div>
          )}
          <p className="text-xs text-gray-400">O logo também aparece no rodapé do site.</p>
        </div>
      )}

      {/* ── BANNER ELEGANCE ── */}
      {section === "elegance" && (
        <div className="max-w-xl space-y-4">
          <SectionHeader title="Banner Elegance" subtitle="A grande seção escura com imagem de fundo" />
          <Field label="Linha pequena (acima do título)"><input className={inputCls} value={eb.tagline} onChange={e => updateData({ eleganceBanner: { ...eb, tagline: e.target.value } })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Título (normal)"><input className={inputCls} value={eb.title} onChange={e => updateData({ eleganceBanner: { ...eb, title: e.target.value } })} /></Field>
            <Field label="Título (destaque rosa)"><input className={inputCls} value={eb.titleHighlight} onChange={e => updateData({ eleganceBanner: { ...eb, titleHighlight: e.target.value } })} /></Field>
          </div>
          <Field label="Subtítulo"><input className={inputCls} value={eb.subtitle} onChange={e => updateData({ eleganceBanner: { ...eb, subtitle: e.target.value } })} /></Field>
          <Field label="Texto do botão"><input className={inputCls} value={eb.buttonText} onChange={e => updateData({ eleganceBanner: { ...eb, buttonText: e.target.value } })} /></Field>
          <ImagePicker label="Imagem de fundo" value={eb.img} onChange={v => updateData({ eleganceBanner: { ...eb, img: v } })} />
        </div>
      )}

      {/* ── ANTES & DEPOIS ── */}
      {section === "resultado" && (
        <div className="max-w-xl space-y-4">
          <SectionHeader title="Seção Antes & Depois" subtitle="O slider de transformação" />
          <Field label="Título"><input className={inputCls} value={rm.title} onChange={e => updateData({ resultadoMagic: { ...rm, title: e.target.value } })} /></Field>
          <Field label="Subtítulo"><input className={inputCls} value={rm.subtitle} onChange={e => updateData({ resultadoMagic: { ...rm, subtitle: e.target.value } })} /></Field>
          <ImagePicker label="Foto ANTES" value={rm.beforeImg} onChange={v => updateData({ resultadoMagic: { ...rm, beforeImg: v } })} />
          <ImagePicker label="Foto DEPOIS" value={rm.afterImg} onChange={v => updateData({ resultadoMagic: { ...rm, afterImg: v } })} />
        </div>
      )}

      {/* ── MOSAICO DE FOTOS ── */}
      {section === "mosaic" && (
        <div>
          <SectionHeader title="Mosaico de fotos e vídeos" subtitle="Fotos e vídeos exibidos na seção 'Quem usa'" />
          {/* View toggle */}
          {!editMosaic && (
            <div className="flex gap-2 mb-4">
              {(["grid", "list"] as const).map(v => (
                <button key={v} onClick={() => setMosaicView(v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${mosaicView === v ? "text-white border-transparent" : "text-gray-500 border-gray-200 bg-white"}`}
                  style={mosaicView === v ? { background: PINK } : {}}>
                  {v === "grid" ? "⊞ Grade visual" : "☰ Lista"}
                </button>
              ))}
              <span className="text-xs text-gray-400 self-center ml-1">
                {mosaicView === "grid" ? "Veja como as fotos ficam no site e reordene" : "Visualização em lista"}
              </span>
            </div>
          )}
          {editMosaic ? (
            <div className="max-w-md space-y-4">
              <h4 className="font-bold text-sm text-gray-700">Editar item</h4>
              <Field label="Tipo de mídia">
                <div className="flex gap-2">
                  {(["image", "video"] as const).map(t => (
                    <button key={t} type="button"
                      onClick={() => setEditMosaic({ ...editMosaic, type: t })}
                      className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition ${(editMosaic.type ?? "image") === t ? "text-white border-transparent" : "border-gray-200 text-gray-500"}`}
                      style={(editMosaic.type ?? "image") === t ? { background: PINK } : {}}>
                      {t === "image" ? "🖼️ Foto" : "🎬 Vídeo"}
                    </button>
                  ))}
                </div>
              </Field>
              {(editMosaic.type ?? "image") === "image" ? (
                <ImagePicker label="Foto" value={editMosaic.img} onChange={v => setEditMosaic({ ...editMosaic, img: v })} />
              ) : (
                <VideoPicker value={editMosaic.videoUrl ?? ""} onChange={v => setEditMosaic({ ...editMosaic, videoUrl: v })} />
              )}
              <Field label="Largura">
                <div className="flex gap-3">
                  {([false, true] as const).map(b => (
                    <button key={String(b)} type="button" onClick={() => setEditMosaic({ ...editMosaic, big: b })}
                      className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition ${editMosaic.big === b ? "text-white border-transparent" : "border-gray-200 text-gray-500"}`}
                      style={editMosaic.big === b ? { background: PINK } : {}}>
                      {b ? "Larga (2 colunas)" : "Normal (1 coluna)"}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Proporção da imagem / vídeo">
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { label: "1:1", value: "1/1", preview: "aspect-square", desc: "Quadrado" },
                    { label: "16:9", value: "16/9", preview: "", desc: "Paisagem (YouTube)" },
                    { label: "9:16", value: "9/16", preview: "", desc: "Retrato (Stories)" },
                    { label: "4:3", value: "4/3", preview: "", desc: "Foto clássica" },
                    { label: "3:4", value: "3/4", preview: "", desc: "Retrato clássico" },
                    { label: "3:2", value: "3/2", preview: "", desc: "Paisagem larga" },
                  ] as const).map(opt => {
                    const selected = (editMosaic.aspectRatio ?? "1/1") === opt.value;
                    return (
                      <button key={opt.value} type="button"
                        onClick={() => setEditMosaic({ ...editMosaic, aspectRatio: opt.value })}
                        className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl border text-xs font-semibold transition ${selected ? "text-white border-transparent" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                        style={selected ? { background: PINK } : {}}>
                        <div className="flex items-center justify-center w-10 h-7"
                          style={{ aspectRatio: opt.value.replace("/", "/"), width: 36, height: "auto" }}>
                          <div className="bg-current opacity-30 rounded"
                            style={{ width: "100%", aspectRatio: opt.value, minHeight: 4, maxHeight: 28, maxWidth: 36 }} />
                        </div>
                        <span>{opt.label}</span>
                        <span className={`text-[9px] font-normal ${selected ? "text-white/80" : "text-gray-400"}`}>{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-400">Personalizado:</span>
                  <input className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                    value={editMosaic.aspectRatio ?? "1/1"}
                    onChange={e => setEditMosaic({ ...editMosaic, aspectRatio: e.target.value })}
                    placeholder="ex: 16/9" />
                </div>
              </Field>
              <div className="flex gap-3">
                <button onClick={saveMosaic} className="flex-1 text-white font-bold rounded-xl py-2.5 text-sm hover:opacity-90 transition flex items-center justify-center gap-2" style={{ background: PINK }}>
                  <Save size={15} /> Salvar
                </button>
                <button onClick={() => setEditMosaic(null)} className="px-5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
              </div>
            </div>
          ) : (
            <div>
              {/* ── GRADE VISUAL ── */}
              {mosaicView === "grid" ? (
                <div>
                  <div
                    className="mb-4 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 p-3"
                    style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                    {data.mosaicPhotos.map((p, i) => {
                      const isVideo = (p.type ?? "image") === "video";
                      const ratio = p.aspectRatio ?? "1/1";
                      return (
                        <div key={p.id}
                          style={{ gridColumn: p.big ? "1 / -1" : undefined }}
                          className="relative rounded-xl overflow-hidden bg-gray-200 group border-2 border-transparent hover:border-pink-400 transition">
                          {/* Thumbnail */}
                          <div style={{ aspectRatio: ratio.replace("/", "/") }}>
                            {isVideo ? (
                              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-4xl">🎬</div>
                            ) : p.img ? (
                              <img src={imgSrc(p.img)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-3xl">🖼️</div>
                            )}
                          </div>

                          {/* Position badge */}
                          <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-black/60 text-white text-[11px] font-black flex items-center justify-center">
                            {i + 1}
                          </div>

                          {/* Type badge */}
                          <div className={`absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded-full font-bold ${isVideo ? "bg-purple-500 text-white" : "bg-blue-500 text-white"}`}>
                            {isVideo ? "VÍD" : "FOTO"}
                          </div>

                          {/* Hover overlay with action buttons */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-between p-2">
                            {/* Move up */}
                            <button onClick={() => moveMosaic(i, -1)} disabled={i === 0}
                              className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition shadow">
                              <ArrowUp size={16} className="text-gray-700" />
                            </button>
                            {/* Edit + Delete row */}
                            <div className="flex gap-2">
                              <button onClick={() => setEditMosaic({ ...p })}
                                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/90 hover:bg-white text-xs font-semibold text-gray-700 transition shadow">
                                <Pencil size={12} /> Editar
                              </button>
                              <button onClick={() => removeMosaic(p.id)}
                                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-xs font-semibold text-white transition shadow">
                                <Trash2 size={12} /> Excluir
                              </button>
                            </div>
                            {/* Move down */}
                            <button onClick={() => moveMosaic(i, 1)} disabled={i === data.mosaicPhotos.length - 1}
                              className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition shadow">
                              <ArrowDown size={16} className="text-gray-700" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Passe o mouse sobre uma foto para ver as opções de mover, editar ou excluir.</p>
                  <button onClick={addMosaic} className="text-white text-sm font-bold rounded-xl px-4 py-2 flex items-center gap-1.5 hover:opacity-90 transition" style={{ background: PINK }}>
                    <Plus size={15} /> Adicionar item
                  </button>
                </div>
              ) : (
                /* ── LISTA ── */
                <div>
                  <div className="space-y-3 mb-4">
                    {data.mosaicPhotos.map((p, i) => (
                      <div key={p.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-100">
                        <div className="flex flex-col gap-1">
                          <button onClick={() => moveMosaic(i, -1)} disabled={i === 0}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 disabled:opacity-20 transition">
                            <ArrowUp size={14} />
                          </button>
                          <div className="text-center text-[10px] font-bold text-gray-300">{i + 1}</div>
                          <button onClick={() => moveMosaic(i, 1)} disabled={i === data.mosaicPhotos.length - 1}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 disabled:opacity-20 transition">
                            <ArrowDown size={14} />
                          </button>
                        </div>
                        {(p.type ?? "image") === "video" ? (
                          <div className="w-14 h-14 rounded-xl bg-gray-800 flex-shrink-0 flex items-center justify-center text-2xl">🎬</div>
                        ) : (
                          <img src={imgSrc(p.img)} alt="" className="w-14 h-14 object-cover rounded-xl flex-shrink-0 bg-gray-200" onError={e => (e.currentTarget.style.display = "none")} />
                        )}
                        <div className="flex-1 min-w-0">
                          {(p.type ?? "image") === "video" ? (
                            <p className="text-xs text-gray-500 truncate">{p.videoUrl || "(sem URL)"}</p>
                          ) : (
                            <p className="text-xs text-gray-500">{p.img ? (p.img.startsWith("data:") ? "(imagem enviada)" : p.img) : "(sem imagem)"}</p>
                          )}
                          <div className="flex gap-1.5 mt-0.5 flex-wrap">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${(p.type ?? "image") === "video" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>{(p.type ?? "image") === "video" ? "Vídeo" : "Foto"}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${p.big ? "bg-pink-100 text-pink-600" : "bg-gray-200 text-gray-500"}`}>{p.big ? "Larga" : "Normal"}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-600">{(p.aspectRatio ?? "1/1").replace("/", ":")}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditMosaic({ ...p })} className="p-2 rounded-lg hover:bg-white border border-gray-200"><Pencil size={13} className="text-gray-500" /></button>
                          <button onClick={() => removeMosaic(p.id)} className="p-2 rounded-lg hover:bg-red-50 border border-gray-200"><Trash2 size={13} className="text-red-400" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={addMosaic} className="text-white text-sm font-bold rounded-xl px-4 py-2 flex items-center gap-1.5 hover:opacity-90 transition" style={{ background: PINK }}>
                    <Plus size={15} /> Adicionar item
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── CARDS DE CATEGORIA ── */}
      {section === "categories" && (
        <div>
          <SectionHeader title="Cards de categoria" subtitle="Os cards do banner de categorias" />
          {editCat ? (
            <div className="max-w-md space-y-4">
              <h4 className="font-bold text-sm text-gray-700">Editar card</h4>
              <Field label="Nome da categoria"><input className={inputCls} value={editCat.label} onChange={e => setEditCat({ ...editCat, label: e.target.value })} /></Field>
              <Field label="Slug (URL)"><input className={inputCls} value={editCat.slug} onChange={e => setEditCat({ ...editCat, slug: e.target.value })} placeholder="shampoo-e-mascara" /></Field>
              <ImagePicker label="Imagem do card" value={editCat.img} onChange={v => setEditCat({ ...editCat, img: v })} />
              <Field label="Cor de fundo (hex)">
                <div className="flex gap-2 items-center">
                  <input type="color" value={editCat.color} onChange={e => setEditCat({ ...editCat, color: e.target.value })} className="w-10 h-10 rounded-lg border border-gray-200 p-0.5 cursor-pointer" />
                  <input className={inputCls} value={editCat.color} onChange={e => setEditCat({ ...editCat, color: e.target.value })} />
                </div>
              </Field>
              <div className="flex gap-3">
                <button onClick={saveCat} className="flex-1 text-white font-bold rounded-xl py-2.5 text-sm hover:opacity-90 transition flex items-center justify-center gap-2" style={{ background: PINK }}>
                  <Save size={15} /> Salvar
                </button>
                <button onClick={() => setEditCat(null)} className="px-5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="space-y-3 mb-4">
                {data.categoryCards.map((c, i) => (
                  <div key={c.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 w-5 text-center">{i + 1}</span>
                    <img src={imgSrc(c.img)} alt={c.label} className="w-12 h-12 object-contain rounded-lg flex-shrink-0 bg-white" onError={e => (e.currentTarget.style.display = "none")} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-800">{c.label || "(sem nome)"}</p>
                      <p className="text-xs text-gray-400">/categoria/{c.slug}</p>
                    </div>
                    <div className="w-5 h-5 rounded-full border border-gray-200 flex-shrink-0" style={{ background: c.color }} />
                    <div className="flex gap-2">
                      <button onClick={() => setEditCat({ ...c })} className="p-2 rounded-lg hover:bg-white border border-gray-200"><Pencil size={13} className="text-gray-500" /></button>
                      <button onClick={() => removeCat(c.id)} className="p-2 rounded-lg hover:bg-red-50 border border-gray-200"><Trash2 size={13} className="text-red-400" /></button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addCat} className="text-white text-sm font-bold rounded-xl px-4 py-2 flex items-center gap-1.5 hover:opacity-90 transition" style={{ background: PINK }}>
                <Plus size={15} /> Adicionar categoria
              </button>
              <p className="text-xs text-gray-400 mt-3">O primeiro card aparece maior (2×2). Os demais ocupam meia largura.</p>
            </div>
          )}
        </div>
      )}

      {/* ── SOBRE NÓS ── */}
      {section === "sobre" && (
        <div className="max-w-xl">
          <SectionHeader title="Página Sobre nós" subtitle="Textos da página /sobre-nos" />
          {editVal ? (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-gray-700">Editar valor</h4>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Ícone (emoji)"><input className={inputCls} value={editVal.icon} onChange={e => setEditVal({ ...editVal, icon: e.target.value })} placeholder="🌿" /></Field>
                <Field label="Título"><input className={inputCls} value={editVal.title} onChange={e => setEditVal({ ...editVal, title: e.target.value })} /></Field>
              </div>
              <Field label="Descrição"><textarea className={textareaCls} rows={2} value={editVal.desc} onChange={e => setEditVal({ ...editVal, desc: e.target.value })} /></Field>
              <div className="flex gap-3">
                <button onClick={saveVal} className="flex-1 text-white font-bold rounded-xl py-2.5 text-sm hover:opacity-90 transition flex items-center justify-center gap-2" style={{ background: PINK }}><Save size={15} /> Salvar</button>
                <button onClick={() => setEditVal(null)} className="px-5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {(() => {
                const sn = data.sobreNos;
                return (
                  <>
                    <Field label="Tagline (acima do título)"><input className={inputCls} value={sn.heroTagline} onChange={e => updateData({ sobreNos: { ...sn, heroTagline: e.target.value } })} /></Field>
                    <Field label="Título principal"><input className={inputCls} value={sn.heroTitle} onChange={e => updateData({ sobreNos: { ...sn, heroTitle: e.target.value } })} /></Field>
                    <Field label="Subtítulo do hero"><input className={inputCls} value={sn.heroSubtitle} onChange={e => updateData({ sobreNos: { ...sn, heroSubtitle: e.target.value } })} /></Field>
                    <Field label="Texto em destaque (verde)"><input className={inputCls} value={sn.highlight} onChange={e => updateData({ sobreNos: { ...sn, highlight: e.target.value } })} /></Field>
                    <Field label="Parágrafo 1"><textarea className={textareaCls} rows={3} value={sn.paragraph1} onChange={e => updateData({ sobreNos: { ...sn, paragraph1: e.target.value } })} /></Field>
                    <Field label="Parágrafo 2"><textarea className={textareaCls} rows={3} value={sn.paragraph2} onChange={e => updateData({ sobreNos: { ...sn, paragraph2: e.target.value } })} /></Field>
                    <Field label="Mensagem final"><input className={inputCls} value={sn.finalMessage} onChange={e => updateData({ sobreNos: { ...sn, finalMessage: e.target.value } })} /></Field>
                    <Field label="Texto do botão CTA"><input className={inputCls} value={sn.ctaText} onChange={e => updateData({ sobreNos: { ...sn, ctaText: e.target.value } })} /></Field>
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-bold text-sm text-gray-700">Valores / Cards</p>
                        <button onClick={() => setEditVal({ id: generateId(), icon: "🌿", title: "", desc: "" })}
                          className="text-white text-xs font-bold rounded-xl px-3 py-1.5 flex items-center gap-1 hover:opacity-90 transition" style={{ background: PINK }}>
                          <Plus size={12} /> Adicionar
                        </button>
                      </div>
                      <div className="space-y-2">
                        {sn.values.map(v => (
                          <div key={v.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <span className="text-2xl flex-shrink-0">{v.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-gray-800">{v.title}</p>
                              <p className="text-xs text-gray-500 truncate">{v.desc}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => setEditVal({ ...v })} className="p-2 rounded-lg hover:bg-white border border-gray-200"><Pencil size={12} className="text-gray-500" /></button>
                              <button onClick={() => removeVal(v.id)} className="p-2 rounded-lg hover:bg-red-50 border border-gray-200"><Trash2 size={12} className="text-red-400" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">Alterações salvas automaticamente.</p>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ── LINKS DO RODAPÉ ── */}
      {section === "footer" && (
        <div className="max-w-xl">
          <SectionHeader title="Links do rodapé" subtitle="Os links que aparecem nas colunas do rodapé" />
          {editLink ? (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-gray-700">Editar link</h4>
              <Field label="Texto do link"><input className={inputCls} value={editLink.label} onChange={e => setEditLink({ ...editLink, label: e.target.value })} /></Field>
              <Field label="URL (ex: /sobre-nos)"><input className={inputCls} value={editLink.href} onChange={e => setEditLink({ ...editLink, href: e.target.value })} placeholder="/sobre-nos" /></Field>
              <Field label="Coluna">
                <div className="flex gap-2">
                  {(["products", "company", "support"] as const).map(col => (
                    <button key={col} type="button" onClick={() => setEditLink({ ...editLink, column: col })}
                      className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition ${editLink.column === col ? "text-white border-transparent" : "border-gray-200 text-gray-500"}`}
                      style={editLink.column === col ? { background: PINK } : {}}>
                      {col === "products" ? "Produtos" : col === "company" ? "Empresa" : "Suporte"}
                    </button>
                  ))}
                </div>
              </Field>
              <div className="flex gap-3">
                <button onClick={saveLink} className="flex-1 text-white font-bold rounded-xl py-2.5 text-sm hover:opacity-90 transition flex items-center justify-center gap-2" style={{ background: PINK }}><Save size={15} /> Salvar</button>
                <button onClick={() => setEditLink(null)} className="px-5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
              </div>
            </div>
          ) : (
            <div>
              {(["products", "company", "support"] as const).map(col => {
                const colLinks = data.footerLinks.filter(l => l.column === col);
                const colLabel = col === "products" ? "Produtos" : col === "company" ? "Empresa" : "Suporte";
                return (
                  <div key={col} className="mb-5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{colLabel}</p>
                    <div className="space-y-2">
                      {colLinks.map(l => (
                        <div key={l.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-800">{l.label}</p>
                            <p className="text-xs text-gray-400">{l.href}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setEditLink({ ...l })} className="p-2 rounded-lg hover:bg-white border border-gray-200"><Pencil size={12} className="text-gray-500" /></button>
                            <button onClick={() => removeLink(l.id)} className="p-2 rounded-lg hover:bg-red-50 border border-gray-200"><Trash2 size={12} className="text-red-400" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              <button onClick={() => setEditLink({ id: generateId(), label: "", href: "/", column: "products" })}
                className="text-white text-sm font-bold rounded-xl px-4 py-2 flex items-center gap-1.5 hover:opacity-90 transition" style={{ background: PINK }}>
                <Plus size={15} /> Adicionar link
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── SETTINGS TAB ─── */
function SettingsTab({ onLogout }: { onLogout: () => void }) {
  const { data, updateData } = useSite();
  const [s, setS] = useState(data.settings);
  const [newPw, setNewPw] = useState("");
  const [pwOk, setPwOk] = useState(false);
  function saveSettings() {
    updateData({ settings: s });
    if (newPw.length >= 4) {
      setAdminPassword(newPw);
      setNewPw("");
      setPwOk(true);
      setTimeout(() => setPwOk(false), 2000);
    }
  }
  return (
    <div className="max-w-xl space-y-6">
      <h3 className="font-black text-lg text-gray-800">Configurações do Site</h3>
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 p-4 space-y-3">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Logo da marca</p>
          <p className="text-xs text-gray-400">Aparece em: cabeçalho fixo · página Produtos · página de categorias · rodapé · página Sobre nós</p>
          <ImagePicker label="Logo (PNG com fundo transparente recomendado)" value={s.logo || "logo-pr.png"} onChange={v => setS({ ...s, logo: v })} />
        </div>
        <Field label="Nome do site"><input className={inputCls} value={s.siteName} onChange={e => setS({ ...s, siteName: e.target.value })} /></Field>
        <Field label="WhatsApp (somente números)"><input className={inputCls} value={s.whatsapp} onChange={e => setS({ ...s, whatsapp: e.target.value })} placeholder="5511999999999" /></Field>
        <Field label="Instagram (URL completa)"><input className={inputCls} value={s.instagram ?? ""} onChange={e => setS({ ...s, instagram: e.target.value })} placeholder="https://instagram.com/suaconta" /></Field>
        <Field label="Facebook (URL completa)"><input className={inputCls} value={s.facebook ?? ""} onChange={e => setS({ ...s, facebook: e.target.value })} placeholder="https://facebook.com/suapagina" /></Field>
        <Field label="E-mail de contato"><input className={inputCls} value={s.email} onChange={e => setS({ ...s, email: e.target.value })} /></Field>
        <Field label="Texto do banner de anúncio (topo)"><input className={inputCls} value={s.announcementText} onChange={e => setS({ ...s, announcementText: e.target.value })} /></Field>
        <Field label="Botão do banner de anúncio"><input className={inputCls} value={s.announcementButton ?? ""} onChange={e => setS({ ...s, announcementButton: e.target.value })} placeholder="APROVEITE AGORA!" /></Field>
        <Field label="Texto sobre a marca (rodapé)"><textarea className={textareaCls} rows={2} value={s.footerAbout} onChange={e => setS({ ...s, footerAbout: e.target.value })} /></Field>
        <Field label="Copyright (rodapé)"><input className={inputCls} value={s.footerCopyright ?? ""} onChange={e => setS({ ...s, footerCopyright: e.target.value })} placeholder="© 2026 Profissional." /></Field>
        <Field label="Formas de pagamento (separadas por vírgula)">
          <input className={inputCls} value={s.paymentMethods ?? ""} onChange={e => setS({ ...s, paymentMethods: e.target.value })} placeholder="Visa,Master,Pix,Boleto" />
          <p className="text-xs text-gray-400 mt-1">Digite os nomes separados por vírgula. Ex: Visa,Master,Pix,Boleto</p>
        </Field>
        <Field label="Chave Secreta do Stripe (sk_live_... ou sk_test_...)" hint="Necessária para ativar o pagamento com cartão.">
          <input className={inputCls} type="password" value={s.stripeKey ?? ""} onChange={e => setS({ ...s, stripeKey: e.target.value })} placeholder="sk_live_..." autoComplete="off" />
          <p className="text-xs text-gray-400 mt-1">Encontre sua chave em: dashboard.stripe.com → Developers → API Keys</p>
        </Field>
        <Field label="Cor principal (hex)">
          <div className="flex gap-2 items-center">
            <input type="color" value={s.primaryColor} onChange={e => setS({ ...s, primaryColor: e.target.value })} className="w-10 h-10 rounded-lg border border-gray-200 p-0.5 cursor-pointer" />
            <input className={inputCls} value={s.primaryColor} onChange={e => setS({ ...s, primaryColor: e.target.value })} />
          </div>
        </Field>
      </div>
      <div className="border-t border-gray-100 pt-5 space-y-3">
        <p className="font-bold text-sm text-gray-700">Acesso ao Admin</p>
        <p className="text-xs text-gray-400">Defina o Gmail que será exigido para entrar nessa área. Se deixar em branco, qualquer e-mail funciona.</p>
        <Field label="Gmail do admin">
          <input type="email" className={inputCls} placeholder="seu@gmail.com"
            defaultValue={getAdminEmail()}
            onBlur={e => setAdminEmail(e.target.value.trim())} />
        </Field>
        <p className="font-bold text-sm text-gray-700 pt-2">Alterar senha do admin</p>
        <input type="password" placeholder="Nova senha (mínimo 4 caracteres)" className={inputCls} value={newPw} onChange={e => setNewPw(e.target.value)} />
        {pwOk && <p className="text-green-600 text-xs">Senha alterada com sucesso!</p>}
      </div>
      <div className="flex gap-3">
        <button onClick={saveSettings} className="flex-1 text-white font-bold rounded-xl py-2.5 text-sm hover:opacity-90 transition flex items-center justify-center gap-2" style={{ background: PINK }}>
          <Save size={15} /> Salvar Configurações
        </button>
        <button onClick={onLogout} className="px-5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-1.5">
          <LogOut size={14} /> Sair
        </button>
      </div>
    </div>
  );
}

/* ─── CATEGORIAS TAB ─── */
function CategoriasTab() {
  const { data, updateData } = useSite();
  const [editCat, setEditCat] = useState<CategoryCard | null>(null);
  const [adding, setAdding] = useState(false);

  const blank: CategoryCard = { id: "", label: "", slug: "", img: "", color: "#fce4ec" };

  function startAdd() { setEditCat({ ...blank, id: generateId() }); setAdding(true); }
  function startEdit(c: CategoryCard) { setEditCat({ ...c }); setAdding(false); }
  function cancel() { setEditCat(null); }

  function save() {
    if (!editCat) return;
    updateData({
      categoryCards: adding
        ? [...data.categoryCards, editCat]
        : data.categoryCards.map(c => c.id === editCat.id ? editCat : c)
    });
    setEditCat(null);
  }

  function remove(id: string) {
    if (!confirm("Remover este card de categoria?")) return;
    updateData({ categoryCards: data.categoryCards.filter(c => c.id !== id) });
  }

  function move(i: number, dir: -1 | 1) {
    const arr = [...data.categoryCards];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    updateData({ categoryCards: arr });
  }

  if (editCat) return (
    <div className="max-w-md">
      <h3 className="font-black text-lg text-gray-800 mb-6">{adding ? "Nova Categoria" : "Editar Categoria"}</h3>
      <div className="space-y-4">
        <Field label="Nome da categoria">
          <input className={inputCls} value={editCat.label} onChange={e => setEditCat({ ...editCat, label: e.target.value })} placeholder="Ex: Shampoos" />
        </Field>
        <Field label="Slug (aparece na URL)" hint="Use letras minúsculas e hífens. Ex: shampoo-e-mascara">
          <input className={inputCls} value={editCat.slug} onChange={e => setEditCat({ ...editCat, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="shampoo-e-mascara" />
        </Field>
        <ImagePicker label="Imagem do card" value={editCat.img} onChange={v => setEditCat({ ...editCat, img: v })} />
        <Field label="Cor de fundo">
          <div className="flex gap-2 items-center">
            <input type="color" value={editCat.color} onChange={e => setEditCat({ ...editCat, color: e.target.value })} className="w-10 h-10 rounded-lg border border-gray-200 p-0.5 cursor-pointer" />
            <input className={inputCls} value={editCat.color} onChange={e => setEditCat({ ...editCat, color: e.target.value })} placeholder="#fce4ec" />
          </div>
        </Field>
        <div className="flex gap-3 pt-2">
          <button onClick={save} className="flex-1 text-white font-bold rounded-xl py-2.5 text-sm hover:opacity-90 transition flex items-center justify-center gap-2" style={{ background: PINK }}>
            <Save size={15} /> Salvar
          </button>
          <button onClick={cancel} className="px-5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-black text-lg text-gray-800">Categorias ({data.categoryCards.length})</h3>
        <button onClick={startAdd} className="text-white text-sm font-bold rounded-xl px-4 py-2 flex items-center gap-1.5 hover:opacity-90 transition" style={{ background: PINK }}>
          <Plus size={15} /> Nova categoria
        </button>
      </div>
      <p className="text-sm text-gray-400 mb-6">Os cards de categoria aparecem na seção de categorias da página inicial e criam páginas acessíveis em <strong>/categoria/slug</strong>.</p>

      {data.categoryCards.length === 0 ? (
        <div className="text-center py-16 text-gray-300 border-2 border-dashed border-gray-200 rounded-2xl">
          <Grid2x2 size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="font-semibold text-gray-400">Nenhuma categoria criada</p>
          <p className="text-sm mt-1">Clique em "Nova categoria" para começar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.categoryCards.map((c, i) => (
            <div key={c.id} className="flex items-center gap-3 bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => move(i, -1)} disabled={i === 0}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20 transition">
                  <ArrowUp size={12} />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === data.categoryCards.length - 1}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20 transition">
                  <ArrowDown size={12} />
                </button>
              </div>
              <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ background: c.color }}>
                {c.img ? (
                  <img src={imgSrc(c.img)} alt={c.label} className="w-10 h-10 object-contain" onError={e => (e.currentTarget.style.display = "none")} />
                ) : (
                  <Grid2x2 size={20} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-800">{c.label || "(sem nome)"}</p>
                <p className="text-xs text-gray-400">/categoria/{c.slug || "..."}</p>
              </div>
              <div className="w-5 h-5 rounded-full border border-gray-200 flex-shrink-0" style={{ background: c.color }} />
              <div className="flex gap-2">
                <button onClick={() => startEdit(c)} className="p-2 rounded-lg hover:bg-gray-100 border border-gray-200 transition"><Pencil size={14} className="text-gray-500" /></button>
                <button onClick={() => remove(c.id)} className="p-2 rounded-lg hover:bg-red-50 border border-gray-200 transition"><Trash2 size={14} className="text-red-400" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-4">O primeiro card aparece maior (2×2). Os demais ocupam meia largura.</p>
    </div>
  );
}

/* ─── LAYOUT TAB ─── */
function LayoutTab() {
  const { data, updateData } = useSite();
  const layout: SectionConfig[] = Array.isArray(data.sectionLayout) && data.sectionLayout.length > 0
    ? data.sectionLayout
    : DEFAULT_SECTION_LAYOUT;
  const customSections: CustomSection[] = Array.isArray(data.customSections) ? data.customSections : [];

  const [editingCustomId, setEditingCustomId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; category: string; label: string }>({ title: "", category: "", label: "" });

  function move(i: number, dir: -1 | 1) {
    const arr = [...layout];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    updateData({ sectionLayout: arr });
  }

  function toggle(i: number) {
    const arr = layout.map((s, idx) => idx === i ? { ...s, visible: !s.visible } : s);
    updateData({ sectionLayout: arr });
  }

  function addCustomSection() {
    const id = "custom_" + generateId();
    const newSection: CustomSection = { id, label: "Nova Seção", title: "Nova Seção de Produtos", category: "", visible: true };
    const newLayoutItem: SectionConfig = { id, label: "Nova Seção", visible: true };
    updateData({
      customSections: [...customSections, newSection],
      sectionLayout: [...layout, newLayoutItem],
    });
    setEditingCustomId(id);
    setEditForm({ title: newSection.title, category: newSection.category, label: newSection.label });
  }

  function startEditCustom(cs: CustomSection) {
    setEditingCustomId(cs.id);
    setEditForm({ title: cs.title, category: cs.category, label: cs.label });
  }

  function saveCustom() {
    if (!editingCustomId) return;
    const updatedCustom = customSections.map(cs =>
      cs.id === editingCustomId ? { ...cs, title: editForm.title, category: editForm.category, label: editForm.label || editForm.title } : cs
    );
    const updatedLayout = layout.map(s =>
      s.id === editingCustomId ? { ...s, label: editForm.label || editForm.title } : s
    );
    updateData({ customSections: updatedCustom, sectionLayout: updatedLayout });
    setEditingCustomId(null);
  }

  function removeCustomSection(id: string) {
    if (!confirm("Remover esta seção?")) return;
    updateData({
      customSections: customSections.filter(cs => cs.id !== id),
      sectionLayout: layout.filter(s => s.id !== id),
    });
  }

  const ICONS: Record<string, string> = {
    hero: "🖼️", categories: "🗂️", bestSellers: "⭐", mosaico: "🎨",
    elegance: "✨", resultadoMagic: "💫", reviews: "💬", salon: "💇", faq: "❓", featured: "🛍️",
  };

  if (editingCustomId) {
    return (
      <div className="max-w-md">
        <h3 className="font-black text-lg text-gray-800 mb-6">Configurar Seção</h3>
        <div className="space-y-4">
          <Field label="Nome interno (aparece no painel)">
            <input className={inputCls} value={editForm.label} onChange={e => setEditForm({ ...editForm, label: e.target.value })} placeholder="Ex: Finalizadores" />
          </Field>
          <Field label="Título exibido no site">
            <input className={inputCls} value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Ex: Nossos Finalizadores" />
          </Field>
          <Field label="Filtrar por categoria" hint="Deixe em branco para mostrar todos os produtos. Use o slug ou label da categoria. Ex: kits, shampoo-e-mascara">
            <input className={inputCls} value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} placeholder="kits" />
          </Field>
          {data.categoryCards.length > 0 && (
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
              <p className="text-xs font-semibold text-gray-500 mb-2">Categorias disponíveis:</p>
              <div className="flex flex-wrap gap-1.5">
                {data.categoryCards.map(c => (
                  <button key={c.id} type="button"
                    onClick={() => setEditForm({ ...editForm, category: c.slug })}
                    className={`text-xs px-2.5 py-1 rounded-full border font-semibold transition ${editForm.category === c.slug ? "text-white border-transparent" : "border-gray-200 text-gray-600 hover:bg-white"}`}
                    style={editForm.category === c.slug ? { background: PINK } : {}}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={saveCustom} className="flex-1 text-white font-bold rounded-xl py-2.5 text-sm hover:opacity-90 transition flex items-center justify-center gap-2" style={{ background: PINK }}>
              <Save size={15} /> Salvar seção
            </button>
            <button onClick={() => setEditingCustomId(null)} className="px-5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-black text-lg text-gray-800">Layout da Página Inicial</h3>
        <button onClick={addCustomSection}
          className="text-white text-xs font-bold rounded-xl px-3 py-2 flex items-center gap-1.5 hover:opacity-90 transition flex-shrink-0" style={{ background: PINK }}>
          <Plus size={13} /> Nova seção
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">Reordene as seções e ative ou desative cada uma. O cabeçalho e rodapé são fixos.</p>

      {/* Fixed top indicator */}
      <div className="flex items-center gap-3 bg-gray-100 rounded-2xl p-3.5 mb-2 opacity-60">
        <div className="w-9 h-9 rounded-xl bg-gray-300 flex items-center justify-center text-base">🔝</div>
        <div className="flex-1">
          <p className="font-bold text-sm text-gray-700">Cabeçalho (fixo)</p>
          <p className="text-xs text-gray-400">Sempre no topo</p>
        </div>
        <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-semibold">Fixo</span>
      </div>

      {/* Sortable sections */}
      <div className="space-y-2 mb-2">
        {layout.map((s, i) => {
          const isCustom = s.id.startsWith("custom_");
          const customData = isCustom ? customSections.find(cs => cs.id === s.id) : null;
          return (
            <div key={s.id}
              className={`flex items-center gap-3 rounded-2xl p-3.5 border-2 transition ${s.visible ? "bg-white border-gray-100" : "bg-gray-50 border-gray-100 opacity-60"}`}>
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button onClick={() => move(i, -1)} disabled={i === 0}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20 transition">
                  <ArrowUp size={12} />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === layout.length - 1}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20 transition">
                  <ArrowDown size={12} />
                </button>
              </div>

              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${s.visible ? (isCustom ? "bg-purple-50" : "bg-pink-50") : "bg-gray-200"}`}>
                {isCustom ? "🆕" : (ICONS[s.id] ?? "📄")}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm ${s.visible ? "text-gray-800" : "text-gray-400"}`}>{s.label}</p>
                <p className="text-xs text-gray-400">
                  {isCustom
                    ? (customData?.category ? `Categoria: ${customData.category}` : "Todos os produtos")
                    : `Posição ${i + 1}`}
                </p>
              </div>

              {isCustom && (
                <button onClick={() => customData && startEditCustom(customData)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 border border-gray-200 transition flex-shrink-0">
                  <Pencil size={12} className="text-gray-500" />
                </button>
              )}

              <button onClick={() => toggle(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition flex-shrink-0 ${s.visible ? "text-white border-transparent" : "text-gray-400 border-gray-200 bg-white hover:bg-gray-50"}`}
                style={s.visible ? { background: PINK } : {}}>
                {s.visible ? <><Eye size={12} /> Visível</> : <><EyeOff size={12} /> Oculto</>}
              </button>

              {isCustom && (
                <button onClick={() => removeCustomSection(s.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 border border-gray-200 transition flex-shrink-0">
                  <Trash2 size={12} className="text-red-400" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Fixed bottom indicator */}
      <div className="flex items-center gap-3 bg-gray-100 rounded-2xl p-3.5 opacity-60">
        <div className="w-9 h-9 rounded-xl bg-gray-300 flex items-center justify-center text-base">🔚</div>
        <div className="flex-1">
          <p className="font-bold text-sm text-gray-700">Rodapé (fixo)</p>
          <p className="text-xs text-gray-400">Sempre no fim</p>
        </div>
        <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-semibold">Fixo</span>
      </div>

      <p className="text-xs text-gray-400 mt-4">Alterações salvas automaticamente e aplicadas no site imediatamente.</p>
    </div>
  );
}

/* ─── DASHBOARD ─── */
function Dashboard() {
  const { data } = useSite();
  const cards = [
    { label: "Produtos", value: data.products.length, color: "#4a90e2" },
    { label: "Avaliações clientes", value: data.reviews.length, color: "#43a047" },
    { label: "Avaliações salões", value: data.salonReviews.length, color: "#8e24aa" },
    { label: "Slides do hero", value: data.heroSlides.length, color: PINK },
    { label: "Perguntas FAQ", value: data.faqs.length, color: "#f5a623" },
    { label: "Fotos mosaico", value: data.mosaicPhotos.length, color: "#00897b" },
  ];
  return (
    <div>
      <h3 className="font-black text-lg text-gray-800 mb-6">Visão Geral</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="rounded-2xl p-5 text-white" style={{ background: c.color }}>
            <p className="text-3xl font-black mb-1">{c.value}</p>
            <p className="text-sm opacity-80">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <p className="font-bold text-sm text-gray-700 mb-1">Cor principal atual</p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full" style={{ background: data.settings.primaryColor }} />
          <span className="text-sm font-mono text-gray-600">{data.settings.primaryColor}</span>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <Link href="/"><button className="flex items-center gap-2 text-sm font-semibold border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50 transition text-gray-600"><Eye size={15} /> Ver site</button></Link>
      </div>
    </div>
  );
}

/* ─── MEDIA LIBRARY TAB ─── */
interface StorageFile {
  name: string;
  url: string;
  type: "image" | "video";
  created_at: string;
  size: number;
}

function MediaLibraryTab() {
  const { data, updateData } = useSite();
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [assigning, setAssigning] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/storage/files");
      if (!res.ok) throw new Error("Erro ao carregar");
      const json = await res.json();
      setFiles(json);
    } catch {
      setError("Não foi possível carregar os arquivos do storage.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  function assignToHeroSlide(url: string, idx: number, field: "img" | "video") {
    const slides = [...data.heroSlides];
    if (!slides[idx]) return;
    slides[idx] = { ...slides[idx], [field]: url };
    updateData({ heroSlides: slides });
    setAssigning(null);
  }

  function assignToProduct(url: string, productId: string) {
    updateData({ products: data.products.map(p => p.id === productId ? { ...p, img: url } : p) });
    setAssigning(null);
  }

  function assignToMosaic(url: string, idx: number) {
    const photos = [...data.mosaicPhotos];
    if (photos[idx]) photos[idx] = { ...photos[idx], img: url };
    else photos.push({ id: generateId(), img: url });
    updateData({ mosaicPhotos: photos });
    setAssigning(null);
  }

  function assignToCategory(url: string, catId: string) {
    updateData({ categoryCards: data.categoryCards.map(c => c.id === catId ? { ...c, img: url } : c) });
    setAssigning(null);
  }

  function assignToElegance(url: string) {
    updateData({ eleganceBanner: { ...data.eleganceBanner, img: url } });
    setAssigning(null);
  }

  function assignToResultadoBefore(url: string) {
    updateData({ resultadoMagic: { ...data.resultadoMagic, beforeImg: url } });
    setAssigning(null);
  }

  function assignToResultadoAfter(url: string) {
    updateData({ resultadoMagic: { ...data.resultadoMagic, afterImg: url } });
    setAssigning(null);
  }

  function formatSize(bytes: number) {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  const images = files.filter(f => f.type === "image");
  const videos = files.filter(f => f.type === "video");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-xl text-gray-800">Biblioteca de Mídia</h3>
          <p className="text-sm text-gray-400 mt-1">{files.length} arquivos no storage — clique numa imagem para reatribuí-la a uma seção</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Atualizar
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 mb-4">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw size={24} className="animate-spin text-gray-300" />
        </div>
      ) : (
        <div className="space-y-8">
          {images.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon size={16} className="text-gray-400" />
                <span className="font-bold text-sm text-gray-700">Imagens ({images.length})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {images.map(file => (
                  <div key={file.name} className="group relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                    <img src={file.url} alt={file.name} className="w-full h-28 object-cover" />
                    <div className="p-2">
                      {file.size > 0 && <p className="text-[10px] text-gray-400">{formatSize(file.size)}</p>}
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5 p-2">
                      <button onClick={() => copyUrl(file.url)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/20 text-white text-xs font-semibold hover:bg-white/30 transition">
                        {copied === file.url ? <Check size={12} /> : <Copy size={12} />}
                        {copied === file.url ? "Copiado!" : "Copiar URL"}
                      </button>
                      <button onClick={() => setAssigning(assigning === file.url ? null : file.url)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition"
                        style={{ background: PINK, color: "#fff" }}>
                        Usar em...
                      </button>
                    </div>
                    {assigning === file.url && (
                      <div className="absolute inset-0 bg-white/98 p-2 overflow-y-auto flex flex-col gap-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Atribuir a:</p>
                        {data.heroSlides.map((_, i) => (
                          <button key={i} onClick={() => assignToHeroSlide(file.url, i, "img")}
                            className="text-left px-2 py-1 rounded-lg text-xs font-semibold hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition">
                            Hero Slide {i + 1} — Imagem
                          </button>
                        ))}
                        {data.products.map(p => (
                          <button key={p.id} onClick={() => assignToProduct(file.url, p.id)}
                            className="text-left px-2 py-1 rounded-lg text-xs font-semibold hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition truncate">
                            Produto: {p.name}
                          </button>
                        ))}
                        {data.mosaicPhotos.map((_, i) => (
                          <button key={i} onClick={() => assignToMosaic(file.url, i)}
                            className="text-left px-2 py-1 rounded-lg text-xs font-semibold hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition">
                            Mosaico Foto {i + 1}
                          </button>
                        ))}
                        {data.categoryCards.map(c => (
                          <button key={c.id} onClick={() => assignToCategory(file.url, c.id)}
                            className="text-left px-2 py-1 rounded-lg text-xs font-semibold hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition truncate">
                            Categoria: {c.label}
                          </button>
                        ))}
                        <button onClick={() => assignToElegance(file.url)}
                          className="text-left px-2 py-1 rounded-lg text-xs font-semibold hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition">
                          Banner Elegance
                        </button>
                        <button onClick={() => assignToResultadoBefore(file.url)}
                          className="text-left px-2 py-1 rounded-lg text-xs font-semibold hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition">
                          Antes & Depois — Antes
                        </button>
                        <button onClick={() => assignToResultadoAfter(file.url)}
                          className="text-left px-2 py-1 rounded-lg text-xs font-semibold hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition">
                          Antes & Depois — Depois
                        </button>
                        <button onClick={() => setAssigning(null)}
                          className="mt-1 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition py-1">
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {videos.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Video size={16} className="text-gray-400" />
                <span className="font-bold text-sm text-gray-700">Vídeos ({videos.length})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {videos.map(file => (
                  <div key={file.name} className="group relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                    <video src={file.url} className="w-full h-28 object-cover" muted playsInline preload="metadata" />
                    <div className="p-2">
                      {file.size > 0 && <p className="text-[10px] text-gray-400">{formatSize(file.size)}</p>}
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5 p-2">
                      <button onClick={() => copyUrl(file.url)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/20 text-white text-xs font-semibold hover:bg-white/30 transition">
                        {copied === file.url ? <Check size={12} /> : <Copy size={12} />}
                        {copied === file.url ? "Copiado!" : "Copiar URL"}
                      </button>
                      <button onClick={() => setAssigning(assigning === file.url ? null : file.url)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition"
                        style={{ background: PINK, color: "#fff" }}>
                        Usar em...
                      </button>
                    </div>
                    {assigning === file.url && (
                      <div className="absolute inset-0 bg-white/98 p-2 overflow-y-auto flex flex-col gap-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Atribuir a:</p>
                        {data.heroSlides.map((_, i) => (
                          <button key={i} onClick={() => assignToHeroSlide(file.url, i, "video")}
                            className="text-left px-2 py-1 rounded-lg text-xs font-semibold hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition">
                            Hero Slide {i + 1} — Vídeo
                          </button>
                        ))}
                        <button onClick={() => setAssigning(null)}
                          className="mt-1 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition py-1">
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {files.length === 0 && !loading && (
            <div className="text-center py-20 text-gray-400">
              <Library size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="font-semibold">Nenhum arquivo no storage</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── USERS TAB ─── */
function UsersTab() {
  const [users, setUsers] = useState<UserAccount[]>(() => getUsers());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (confirmDelete === id) {
      const updated = users.filter(u => u.id !== id);
      saveUsers(updated);
      setUsers(updated);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  }

  return (
    <div className="max-w-2xl">
      <h3 className="font-black text-lg text-gray-800 mb-1">Usuários cadastrados</h3>
      <p className="text-sm text-gray-400 mb-6">{users.length} conta{users.length !== 1 ? "s" : ""} registrada{users.length !== 1 ? "s" : ""}</p>
      {users.length === 0 ? (
        <div className="text-center py-16 text-gray-300">
          <p className="text-base font-semibold">Nenhum usuário ainda</p>
          <p className="text-sm mt-1">As contas criadas na loja aparecerão aqui.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map(u => {
            const initials = u.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
            const since = new Date(u.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
            return (
              <div key={u.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0" style={{ background: PINK }}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-800 truncate">{u.name}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  <p className="text-xs text-gray-300">Desde {since}</p>
                </div>
                <button
                  onClick={() => handleDelete(u.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex-shrink-0 ${confirmDelete === u.id ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500"}`}>
                  {confirmDelete === u.id ? "Confirmar?" : <Trash2 size={13} />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

type Tab = "dashboard" | "products" | "hero" | "reviews" | "faq" | "content" | "categorias" | "layout" | "settings" | "media" | "users";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
  { id: "products", label: "Produtos", icon: <Package size={17} /> },
  { id: "categorias", label: "Categorias", icon: <Grid2x2 size={17} /> },
  { id: "hero", label: "Hero / Slides", icon: <Image size={17} /> },
  { id: "reviews", label: "Depoimentos", icon: <MessageSquare size={17} /> },
  { id: "faq", label: "FAQ", icon: <MessageSquare size={17} /> },
  { id: "content", label: "Conteúdo", icon: <FileText size={17} /> },
  { id: "layout", label: "Layout / Seções", icon: <Layers size={17} /> },
  { id: "users", label: "Usuários", icon: <Lock size={17} /> },
  { id: "settings", label: "Configurações", icon: <Settings size={17} /> },
  { id: "media", label: "Biblioteca", icon: <Library size={17} /> },
];

function SaveIndicator() {
  const { saveStatus, hasUnsaved, saveToServer, reloadFromServer } = useSite();
  const [confirmRevert, setConfirmRevert] = useState(false);

  const isSaving = saveStatus === "saving";

  function handleRevert() {
    if (!confirmRevert) { setConfirmRevert(true); setTimeout(() => setConfirmRevert(false), 3000); return; }
    setConfirmRevert(false);
    reloadFromServer();
  }

  const statusBadge = saveStatus !== "idle" ? (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold mx-3 mb-2 ${
      saveStatus === "saving"        ? "bg-yellow-50 border-yellow-200 text-yellow-700" :
      saveStatus === "saved"         ? "bg-green-50 border-green-200 text-green-700" :
      saveStatus === "no-server-data"? "bg-amber-50 border-amber-200 text-amber-700" :
                                       "bg-red-50 border-red-200 text-red-700"
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
        saveStatus === "saving"         ? "bg-yellow-400 animate-pulse" :
        saveStatus === "saved"          ? "bg-green-500" :
        saveStatus === "no-server-data" ? "bg-amber-400" : "bg-red-500"
      }`} />
      {saveStatus === "saving"         ? "Salvando..." :
       saveStatus === "saved"          ? "Salvo para todos ✓" :
       saveStatus === "no-server-data" ? "Nenhuma versão salva no servidor" :
                                         "Erro ao salvar"}
    </div>
  ) : null;

  return (
    <div className="px-3 mb-2 space-y-2">
      <button
        onClick={saveToServer}
        disabled={isSaving || !hasUnsaved}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={hasUnsaved && !isSaving ? { background: PINK, color: "#fff" } : { background: "#f3f4f6", color: "#9ca3af" }}
      >
        <Save size={14} />
        {isSaving ? "Salvando..." : hasUnsaved ? "Salvar alterações" : "Sem alterações"}
      </button>
      <button
        onClick={handleRevert}
        disabled={isSaving}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed border"
        style={confirmRevert ? { background: "#fff3f3", borderColor: "#fca5a5", color: "#dc2626" } : { background: "#f9fafb", borderColor: "#e5e7eb", color: "#6b7280" }}
      >
        <X size={12} />
        {confirmRevert ? "Confirmar reversão?" : "Reverter para versão salva"}
      </button>
      {hasUnsaved && saveStatus === "idle" && (
        <p className="text-[10px] text-center text-amber-500 font-medium">● Alterações não salvas</p>
      )}
      {statusBadge}
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "1");
  const [tab, setTab] = useState<Tab>("dashboard");
  function logout() { sessionStorage.removeItem("admin_auth"); setAuthed(false); }
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col min-h-screen flex-shrink-0">
        <div className="p-5 border-b border-gray-100">
          <p className="font-black text-base text-gray-900">Admin Panel</p>
          <p className="text-xs text-gray-400">PR Profissional</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition text-left ${tab === t.id ? "text-white" : "text-gray-500 hover:bg-gray-50"}`}
              style={tab === t.id ? { background: PINK } : {}}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
        <SaveIndicator />
        <div className="p-3 border-t border-gray-100">
          <Link href="/"><button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition"><Eye size={15} /> Ver site</button></Link>
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition mt-1"><LogOut size={15} /> Sair</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {tab === "dashboard" && <Dashboard />}
        {tab === "products" && <ProductsTab />}
        {tab === "hero" && <HeroTab />}
        {tab === "reviews" && <ReviewsTab />}
        {tab === "faq" && <FaqTab />}
        {tab === "content" && <ContentTab />}
        {tab === "categorias" && <CategoriasTab />}
        {tab === "layout" && <LayoutTab />}
        {tab === "users" && <UsersTab />}
        {tab === "settings" && <SettingsTab onLogout={logout} />}
        {tab === "media" && <MediaLibraryTab />}
      </main>
    </div>
  );
}
