import { useState, useRef } from "react";
import { Link } from "wouter";
import {
  LayoutDashboard, Package, Image, MessageSquare, Settings,
  Plus, Pencil, Trash2, Save, X, Eye, Star, Lock, LogOut, ChevronLeft
} from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { getAdminPassword, setAdminPassword, generateId, Product, Review, FaqItem } from "@/lib/siteData";

const PINK = "#e8006f";

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === getAdminPassword()) {
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
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: PINK }}>
          <Lock size={28} className="text-white" />
        </div>
        <h1 className="font-black text-2xl text-gray-900 mb-1">Área Admin</h1>
        <p className="text-gray-400 text-sm mb-7">PR Profissional</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Senha"
            value={pw}
            onChange={e => setPw(e.target.value)}
            className={`w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition ${error ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-pink-400"}`}
          />
          {error && <p className="text-red-500 text-xs">Senha incorreta</p>}
          <button type="submit"
            className="w-full text-white font-bold rounded-xl py-3 text-sm transition hover:opacity-90"
            style={{ background: PINK }}>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-400 transition";
const textareaCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-400 transition resize-none";

function ProductsTab() {
  const { data, updateData } = useSite();
  const [editing, setEditing] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);
  const blank: Product = { id: "", name: "", ml: "", price: "", old: "", stars: 5, badge: "", img: "", category: "", categoryLabel: "", color: PINK };

  function startAdd() { setEditing({ ...blank, id: generateId() }); setAdding(true); }
  function startEdit(p: Product) { setEditing({ ...p }); setAdding(false); }
  function cancel() { setEditing(null); }

  function save() {
    if (!editing) return;
    const updated = adding
      ? [...data.products, editing]
      : data.products.map(p => p.id === editing.id ? editing : p);
    updateData({ products: updated });
    setEditing(null);
  }

  function remove(id: string) {
    if (!confirm("Remover este produto?")) return;
    updateData({ products: data.products.filter(p => p.id !== id) });
  }

  if (editing) {
    return (
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
          <Field label="Imagem (nome do arquivo ou URL)"><input className={inputCls} value={editing.img} onChange={e => setEditing({ ...editing, img: e.target.value })} placeholder="product-progressiva.png" /></Field>
          <Field label="Cor do card (hex)"><input className={inputCls} value={editing.color} onChange={e => setEditing({ ...editing, color: e.target.value })} placeholder="#e8006f" /></Field>
          <Field label="Estrelas"><StarsInput value={editing.stars} onChange={n => setEditing({ ...editing, stars: n })} /></Field>
          {editing.img && (
            <div className="rounded-xl overflow-hidden border border-gray-100 h-28 flex items-center justify-center bg-gray-50">
              <img src={editing.img.startsWith("http") ? editing.img : `${import.meta.env.BASE_URL}${editing.img}`} alt="" className="h-24 object-contain" onError={e => (e.currentTarget.style.display = "none")} />
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={save} className="flex-1 text-white font-bold rounded-xl py-2.5 text-sm hover:opacity-90 transition flex items-center justify-center gap-2" style={{ background: PINK }}>
              <Save size={15} /> Salvar
            </button>
            <button onClick={cancel} className="px-5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
          </div>
        </div>
      </div>
    );
  }

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
            <img src={p.img.startsWith("http") ? p.img : `${import.meta.env.BASE_URL}${p.img}`} alt={p.name}
              className="w-14 h-14 object-contain flex-shrink-0 rounded-lg bg-white" onError={e => (e.currentTarget.style.display = "none")} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-800 truncate">{p.name}</p>
              <p className="text-xs text-gray-400">{p.ml} · {p.categoryLabel}</p>
              <p className="text-xs font-black" style={{ color: PINK }}>{p.price}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-white transition border border-gray-200">
                <Pencil size={14} className="text-gray-500" />
              </button>
              <button onClick={() => remove(p.id)} className="p-2 rounded-lg hover:bg-red-50 transition border border-gray-200">
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
                <Field label="Imagem de fundo (nome do arquivo ou URL)">
                  <input className={inputCls} value={s.img} onChange={e => update(s.id, "img", e.target.value)} />
                </Field>
              </div>
              <div className="rounded-xl overflow-hidden bg-gray-200 h-44 flex items-center justify-center relative">
                <img src={s.img.startsWith("http") ? s.img : `${import.meta.env.BASE_URL}${s.img}`} alt=""
                  className="absolute inset-0 w-full h-full object-cover" onError={e => (e.currentTarget.style.opacity = "0")} />
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
    const updated = adding ? [...list, editing] : list.map(r => r.id === editing.id ? editing : r);
    updateData({ [key]: updated });
    setEditing(null);
  }

  function remove(id: string) {
    if (!confirm("Remover esta avaliação?")) return;
    const key = section === "reviews" ? "reviews" : "salonReviews";
    const list = data[key] as Review[];
    updateData({ [key]: list.filter(r => r.id !== id) });
  }

  if (editing) {
    return (
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
          <Field label="Foto (nome do arquivo ou URL)"><input className={inputCls} value={editing.img} onChange={e => setEditing({ ...editing, img: e.target.value })} placeholder="avatar-1.jpg" /></Field>
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
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {(["reviews", "salon"] as const).map(s => (
            <button key={s} onClick={() => setSection(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${section === s ? "text-white border-transparent" : "text-gray-500 border-gray-200 bg-white"}`}
              style={section === s ? { background: PINK, borderColor: PINK } : {}}>
              {s === "reviews" ? "Clientes" : "Salões / Profissionais"}
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
            <img src={r.img.startsWith("http") ? r.img : `${import.meta.env.BASE_URL}${r.img}`} alt={r.name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0" onError={e => (e.currentTarget.style.display = "none")} />
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
    const updated = adding ? [...data.faqs, editing] : data.faqs.map(f => f.id === editing.id ? editing : f);
    updateData({ faqs: updated });
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

  if (editing) {
    return (
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
  }

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
        <Field label="Nome do site"><input className={inputCls} value={s.siteName} onChange={e => setS({ ...s, siteName: e.target.value })} /></Field>
        <Field label="WhatsApp (somente números)"><input className={inputCls} value={s.whatsapp} onChange={e => setS({ ...s, whatsapp: e.target.value })} placeholder="5511999999999" /></Field>
        <Field label="E-mail de contato"><input className={inputCls} value={s.email} onChange={e => setS({ ...s, email: e.target.value })} /></Field>
        <Field label="Texto do banner de anúncio"><input className={inputCls} value={s.announcementText} onChange={e => setS({ ...s, announcementText: e.target.value })} /></Field>
        <Field label="Texto sobre a marca (rodapé)"><textarea className={textareaCls} rows={2} value={s.footerAbout} onChange={e => setS({ ...s, footerAbout: e.target.value })} /></Field>
        <Field label="Cor principal (hex)">
          <div className="flex gap-2 items-center">
            <input type="color" value={s.primaryColor} onChange={e => setS({ ...s, primaryColor: e.target.value })}
              className="w-10 h-10 rounded-lg border border-gray-200 p-0.5 cursor-pointer" />
            <input className={inputCls} value={s.primaryColor} onChange={e => setS({ ...s, primaryColor: e.target.value })} />
          </div>
        </Field>
      </div>

      <div className="border-t border-gray-100 pt-5 space-y-3">
        <p className="font-bold text-sm text-gray-700">Alterar senha do admin</p>
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

type Tab = "dashboard" | "products" | "hero" | "reviews" | "faq" | "settings";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
  { id: "products", label: "Produtos", icon: <Package size={17} /> },
  { id: "hero", label: "Hero / Banner", icon: <Image size={17} /> },
  { id: "reviews", label: "Avaliações", icon: <MessageSquare size={17} /> },
  { id: "faq", label: "FAQ", icon: <MessageSquare size={17} /> },
  { id: "settings", label: "Configurações", icon: <Settings size={17} /> },
];

function Dashboard() {
  const { data } = useSite();
  const cards = [
    { label: "Produtos", value: data.products.length, color: "#4a90e2" },
    { label: "Avaliações clientes", value: data.reviews.length, color: "#43a047" },
    { label: "Avaliações salões", value: data.salonReviews.length, color: "#8e24aa" },
    { label: "Slides do hero", value: data.heroSlides.length, color: PINK },
    { label: "Perguntas FAQ", value: data.faqs.length, color: "#f5a623" },
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
        <Link href="/">
          <button className="flex items-center gap-2 text-sm font-semibold border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50 transition text-gray-600">
            <Eye size={15} /> Ver site
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "1");
  const [tab, setTab] = useState<Tab>("dashboard");

  function logout() {
    sessionStorage.removeItem("admin_auth");
    setAuthed(false);
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
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
        <div className="p-3 border-t border-gray-100">
          <Link href="/">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition">
              <Eye size={15} /> Ver site
            </button>
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition mt-1">
            <LogOut size={15} /> Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        {tab === "dashboard" && <Dashboard />}
        {tab === "products" && <ProductsTab />}
        {tab === "hero" && <HeroTab />}
        {tab === "reviews" && <ReviewsTab />}
        {tab === "faq" && <FaqTab />}
        {tab === "settings" && <SettingsTab onLogout={logout} />}
      </main>
    </div>
  );
}
