import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Truck, MapPin, CreditCard, Loader2, Check, ChevronRight,
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Shield, Package,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SharedHeader } from "@/components/SharedHeader";
import { SharedFooter } from "@/components/SharedFooter";

const PINK = "#e8006f";
const DARK_RED = "#c0003d";

function parsePriceBRL(p: string): number {
  return parseFloat(p.replace(/[R$\s]/g, "").replace(",", ".")) || 0;
}

function formatBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function imgSrc(v: string) {
  if (!v) return "";
  return v.startsWith("data:") || v.startsWith("http") ? v : `${import.meta.env.BASE_URL}${v}`;
}

export default function Checkout() {
  const { items, updateQty, removeItem } = useCart();
  const [, navigate] = useLocation();

  // Subtotal dos produtos do carrinho
  const subtotal = items.reduce((s, i) => s + parsePriceBRL(i.price) * i.qty, 0);

  // --- Estado do formulário de entrega ---
  const [form, setForm] = useState({
    nome: "", email: "", cep: "", rua: "", numero: "",
    complemento: "", bairro: "", cidade: "", estado: "",
  });
  const [formErros, setFormErros] = useState<Record<string, string>>({});
  const [freteInfo, setFreteInfo] = useState<{
    valorFrete: number; regiao: string; prazo: string; descricao: string;
  } | null>(null);
  const [freteLoading, setFreteLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutErro, setCheckoutErro] = useState("");

  function setField(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    setFormErros(e => ({ ...e, [field]: "" }));
    if (field === "cep") { setFreteInfo(null); setCheckoutErro(""); }
  }

  /** Ao completar o CEP, consulta ViaCEP e calcula o frete */
  async function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
    const formatted = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    setField("cep", formatted);

    if (digits.length === 8) {
      setFreteLoading(true);
      setFormErros(er => ({ ...er, cep: "" }));
      try {
        // 1. Busca endereço no ViaCEP
        const viaCep = await fetch(`https://viacep.com.br/ws/${digits}/json/`).then(r => r.json());
        if (!viaCep.erro) {
          setForm(f => ({
            ...f,
            cep: formatted,
            rua:    viaCep.logradouro || f.rua,
            bairro: viaCep.bairro    || f.bairro,
            cidade: viaCep.localidade || f.cidade,
            estado: viaCep.uf        || f.estado,
          }));
        }
        // 2. Calcula frete no backend passando o UF para precisão por estado
        const uf = viaCep.uf || "";
        const freteJson = await fetch(
          `${import.meta.env.BASE_URL}api/frete?cep=${digits}${uf ? `&uf=${uf}` : ""}`
        ).then(r => r.json());

        if (freteJson.error) {
          setFormErros(er => ({ ...er, cep: freteJson.error }));
        } else {
          setFreteInfo({
            valorFrete: freteJson.valorFrete,
            regiao:     freteJson.regiao,
            prazo:      freteJson.prazo,
            descricao:  freteJson.descricao,
          });
        }
      } catch {
        setFormErros(er => ({ ...er, cep: "Não foi possível consultar o CEP." }));
      } finally {
        setFreteLoading(false);
      }
    }
  }

  /** Valida todos os campos obrigatórios */
  function validarForm(): boolean {
    const e: Record<string, string> = {};
    if (!form.nome.trim())  e.nome = "Informe seu nome completo.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Informe um e-mail válido.";
    if (form.cep.replace(/\D/g, "").length !== 8) e.cep = "Informe um CEP válido.";
    if (!form.rua.trim())    e.rua    = "Informe o endereço.";
    if (!form.numero.trim()) e.numero = "Informe o número.";
    if (!form.bairro.trim()) e.bairro = "Informe o bairro.";
    if (!form.cidade.trim()) e.cidade = "Informe a cidade.";
    if (!form.estado.trim()) e.estado = "Informe o estado.";
    if (!freteInfo)          e.cep    = e.cep || "Aguarde o cálculo do frete.";
    setFormErros(e);
    return Object.keys(e).length === 0;
  }

  /** Cria preferência no Mercado Pago e redireciona */
  async function finalizarCompra() {
    if (!validarForm() || !freteInfo) return;
    if (items.length === 0) { setCheckoutErro("Seu carrinho está vazio."); return; }

    setCheckoutLoading(true);
    setCheckoutErro("");

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Cada produto do carrinho como item separado
          items: [
            ...items.map(i => ({
              title:      i.name,
              quantity:   i.qty,
              unit_price: parsePriceBRL(i.price),
            })),
            // Frete como item adicional
            {
              title:      `Frete — ${freteInfo.regiao} (${freteInfo.prazo})`,
              quantity:   1,
              unit_price: freteInfo.valorFrete,
            },
          ],
          // Dados do comprador pré-preenchidos no checkout do MP
          payer: {
            name:  form.nome,
            email: form.email,
            address: {
              zip_code:      form.cep.replace(/\D/g, ""),
              street_name:   `${form.rua}${form.bairro ? `, ${form.bairro}` : ""}`,
              street_number: parseInt(form.numero) || 0,
            },
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.init_point) {
        setCheckoutErro(json.error || "Erro ao criar pagamento. Tente novamente.");
      } else {
        window.location.href = json.init_point;
      }
    } catch {
      setCheckoutErro("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  // Campo reutilizável
  function Field({
    label, name, type = "text", placeholder, maxLength, inputMode, value, onChange, required = true,
  }: {
    label: string; name: string; type?: string; placeholder: string;
    maxLength?: number; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
  }) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-600">{label}{required && " *"}</label>
        <input
          type={type} placeholder={placeholder} value={value} onChange={onChange}
          maxLength={maxLength} inputMode={inputMode}
          className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-1 transition
            ${formErros[name] ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:border-pink-400 focus:ring-pink-200"}`}
        />
        {formErros[name] && <p className="text-red-500 text-xs">{formErros[name]}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedHeader />

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-1 text-xs text-gray-400">
        <Link href="/" className="hover:text-pink-600 transition">Início</Link>
        <ChevronRight size={12} />
        <span style={{ color: PINK }} className="font-semibold">Finalizar pedido</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        <h1 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <Package size={22} style={{ color: PINK }} />
          Finalizar pedido
        </h1>

        {items.length === 0 ? (
          /* Carrinho vazio */
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <ShoppingCart size={48} className="text-gray-200" />
            <p className="text-xl font-black text-gray-700">Seu carrinho está vazio</p>
            <p className="text-gray-400 text-sm">Adicione produtos antes de finalizar.</p>
            <Link href="/produtos">
              <button className="mt-2 text-white font-bold rounded-full px-8 py-3 hover:opacity-90 transition"
                style={{ background: PINK }}>Ver produtos</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* ── Coluna esquerda: Formulário de entrega ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
              <h2 className="font-black text-gray-800 text-base flex items-center gap-2">
                <Truck size={18} style={{ color: PINK }} />
                Dados de entrega
              </h2>

              <Field label="Nome completo" name="nome" placeholder="Seu nome completo"
                value={form.nome} onChange={e => setField("nome", e.target.value)} />

              <Field label="E-mail" name="email" type="email" placeholder="seu@email.com"
                value={form.email} onChange={e => setField("email", e.target.value)} />

              {/* CEP com auto-preenchimento e cálculo de frete */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">CEP *</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text" inputMode="numeric" placeholder="00000-000"
                    value={form.cep} onChange={handleCepChange} maxLength={9}
                    className={`w-full pl-8 pr-8 py-2.5 rounded-xl border text-sm bg-white
                      focus:outline-none focus:ring-1 transition
                      ${formErros.cep ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:border-pink-400 focus:ring-pink-200"}`}
                  />
                  {freteLoading && (
                    <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
                  )}
                </div>
                {formErros.cep && <p className="text-red-500 text-xs">{formErros.cep}</p>}
                {freteLoading && <p className="text-gray-400 text-xs">Consultando CEP e calculando frete...</p>}

                {/* Resultado do frete */}
                {freteInfo && !freteLoading && (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2.5 mt-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Truck size={13} className="text-green-600" />
                        <span className="text-xs font-bold text-green-700">
                          Frete para {freteInfo.regiao}
                        </span>
                      </div>
                      <span className="text-xs font-black text-green-700">
                        {formatBRL(freteInfo.valorFrete)}
                      </span>
                    </div>
                    <span className="text-xs text-green-600 pl-5">
                      Prazo estimado: {freteInfo.prazo}
                    </span>
                  </div>
                )}
              </div>

              <Field label="Endereço" name="rua" placeholder="Rua, Avenida..."
                value={form.rua} onChange={e => setField("rua", e.target.value)} />

              <div className="grid grid-cols-2 gap-3">
                <Field label="Número" name="numero" placeholder="123"
                  value={form.numero} onChange={e => setField("numero", e.target.value)} />
                <Field label="Complemento" name="complemento" placeholder="Apto, bloco..."
                  required={false} value={form.complemento}
                  onChange={e => setField("complemento", e.target.value)} />
              </div>

              <Field label="Bairro" name="bairro" placeholder="Seu bairro"
                value={form.bairro} onChange={e => setField("bairro", e.target.value)} />

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <Field label="Cidade" name="cidade" placeholder="Sua cidade"
                    value={form.cidade} onChange={e => setField("cidade", e.target.value)} />
                </div>
                <Field label="Estado" name="estado" placeholder="UF" maxLength={2}
                  value={form.estado}
                  onChange={e => setField("estado", e.target.value.toUpperCase().slice(0, 2))} />
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <Shield size={13} />
                Seus dados são protegidos e usados apenas para entrega.
              </div>
            </div>

            {/* ── Coluna direita: Resumo do pedido ── */}
            <div className="flex flex-col gap-4">

              {/* Itens do carrinho */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="font-black text-gray-800 text-base mb-4 flex items-center gap-2">
                  <ShoppingCart size={18} style={{ color: PINK }} />
                  Itens do pedido
                </h2>

                <div className="flex flex-col gap-3">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                        style={{ background: `linear-gradient(145deg, ${item.color}18, ${item.color}35)` }}>
                        <img src={imgSrc(item.img)} alt={item.name} className="w-12 h-12 object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-800 leading-tight truncate">{item.name}</p>
                        <p className="font-black text-sm mt-0.5" style={{ color: PINK }}>{item.price}</p>
                        {/* Controles de quantidade */}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <button onClick={() => updateQty(item.id, item.qty - 1)}
                            className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
                            <Minus size={10} className="text-gray-600" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
                            <Plus size={10} className="text-gray-600" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm font-bold text-gray-700">
                          {formatBRL(parsePriceBRL(item.price) * item.qty)}
                        </span>
                        <button onClick={() => removeItem(item.id)}
                          className="p-1 hover:bg-red-50 rounded-lg transition">
                          <Trash2 size={13} className="text-gray-300 hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo de valores */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
                <h2 className="font-black text-gray-800 text-base mb-1">Resumo</h2>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} item{items.reduce((s, i) => s + i.qty, 0) !== 1 ? "s" : ""})</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Frete</span>
                  {freteInfo
                    ? <span className="text-green-700 font-bold">{formatBRL(freteInfo.valorFrete)}</span>
                    : <span className="text-gray-400 italic">informe o CEP</span>}
                </div>

                {freteInfo && (
                  <p className="text-xs text-gray-400">
                    <Truck size={11} className="inline mr-1" />
                    {freteInfo.regiao} — {freteInfo.prazo}
                  </p>
                )}

                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="text-xl font-black" style={{ color: PINK }}>
                    {formatBRL(subtotal + (freteInfo?.valorFrete ?? 0))}
                  </span>
                </div>

                {/* Botão principal */}
                <button
                  onClick={finalizarCompra}
                  disabled={checkoutLoading}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-black text-base transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                  style={{ background: "#009ee3" }}>
                  {checkoutLoading
                    ? <><Loader2 size={18} className="animate-spin" /> Aguarde...</>
                    : <><CreditCard size={18} /> Finalizar compra</>}
                </button>

                {checkoutErro && (
                  <p className="text-red-500 text-xs text-center font-medium">{checkoutErro}</p>
                )}

                {!freteInfo && !checkoutErro && (
                  <p className="text-xs text-gray-400 text-center">
                    Preencha o CEP para calcular o frete e habilitar o pagamento
                  </p>
                )}

                <Link href="/produtos">
                  <button className="w-full py-3 rounded-2xl font-bold text-sm border-2 hover:bg-pink-50 transition flex items-center justify-center gap-1.5"
                    style={{ borderColor: PINK, color: PINK }}>
                    <ArrowLeft size={14} />
                    Continuar comprando
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <SharedFooter />
    </div>
  );
}
