import { useState } from "react";
import { Link } from "wouter";
import { Loader2, Package, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { useSite } from "@/context/SiteContext";

const PINK = "#e8006f";
const DARK_PINK = "#c0003d";

type Step = {
  step: string;
  desc: string;
  date: string;
  done: boolean;
  active: boolean;
};

type TrackingResult = {
  codigo: string;
  produto: string;
  previsao: string | null;
  steps: Step[];
};

export default function RastrearPedido() {
  const { data } = useSite();
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState<TrackingResult | null>(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function buscar(e: React.FormEvent) {
    e.preventDefault();
    const cod = codigo.trim();
    if (!cod) return;
    setErro("");
    setResultado(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.BASE_URL}api/rastrear?codigo=${encodeURIComponent(cod)}`
      );
      const json = await res.json();
      if (!res.ok) {
        setErro(json.error ?? "Erro ao consultar. Tente novamente.");
      } else {
        setResultado(json as TrackingResult);
      }
    } catch {
      setErro("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const logo = data.settings.logo || "logo-pr.webp";
  const logoSrc = logo.startsWith("data:") || logo.startsWith("http")
    ? logo
    : `${import.meta.env.BASE_URL}${logo}`;

  const progress = resultado
    ? Math.round((resultado.steps.filter(s => s.done).length / resultado.steps.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 transition">← Voltar</Link>
          <span className="text-gray-300">|</span>
          <img src={logoSrc} alt={data.settings.siteName} className="h-9 w-auto"
            onError={e => (e.currentTarget.style.display = "none")} />
        </div>
      </header>

      <section style={{ background: `linear-gradient(135deg, ${PINK}, ${DARK_PINK})` }} className="text-white py-14 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white/60 text-sm uppercase tracking-widest mb-3">Suporte</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Rastrear pedido</h1>
          <p className="text-white/75 text-base">
            Digite o código de rastreamento dos Correios para acompanhar a entrega.
          </p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-xl mx-auto">
          <form onSubmit={buscar} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Código de rastreamento
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={codigo}
                onChange={e => { setCodigo(e.target.value); setErro(""); setResultado(null); }}
                placeholder="Ex: AA123456789BR"
                autoComplete="off"
                maxLength={13}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-pink-400 transition uppercase"
                style={{ "--tw-ring-color": `${PINK}30` } as React.CSSProperties}
              />
              <button
                type="submit"
                disabled={loading || !codigo.trim()}
                className="text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm flex items-center gap-2 disabled:opacity-60"
                style={{ background: PINK }}
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Package size={15} />}
                {loading ? "Buscando..." : "Buscar"}
              </button>
            </div>

            {erro && (
              <div className="mt-4 flex items-start gap-2 text-red-500">
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <p className="text-sm">{erro}</p>
              </div>
            )}

            <p className="mt-3 text-xs text-gray-400">
              O código está no e-mail de confirmação ou na etiqueta do pacote. Formato: 2 letras + 9 números + 2 letras (ex: AA000000000BR).
            </p>
          </form>

          {resultado && (
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Código</p>
                  <p className="font-bold text-gray-800 tracking-widest">{resultado.codigo}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{resultado.produto}</p>
                </div>
                {resultado.previsao && (
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">Previsão de entrega</p>
                    <p className="font-semibold" style={{ color: PINK }}>{resultado.previsao}</p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progresso</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${progress}%`, background: PINK }}
                  />
                </div>
              </div>

              <div className="space-y-0">
                {resultado.steps.map((s, i) => {
                  const isLast = i === resultado.steps.length - 1;
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        {s.active ? (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: PINK }}>
                            <CheckCircle2 size={18} className="text-white" />
                          </div>
                        ) : s.done ? (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2"
                            style={{ borderColor: PINK, background: "#fdf0f6" }}>
                            <CheckCircle2 size={16} style={{ color: PINK }} />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-gray-200 bg-white">
                            <Circle size={16} className="text-gray-300" />
                          </div>
                        )}
                        {!isLast && (
                          <div
                            className="w-0.5 flex-1 my-1"
                            style={{ minHeight: 28, background: s.done ? PINK : "#e5e7eb" }}
                          />
                        )}
                      </div>
                      <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                        <p
                          className="font-semibold text-sm"
                          style={s.active ? { color: PINK } : { color: s.done ? "#1f2937" : "#9ca3af" }}
                        >
                          {s.step}
                          {s.active && (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full"
                              style={{ background: "#fdf0f6", color: PINK }}>
                              Último evento
                            </span>
                          )}
                        </p>
                        {s.desc && (
                          <p className={`text-xs mt-0.5 ${s.done ? "text-gray-500" : "text-gray-300"}`}>
                            {s.desc}
                          </p>
                        )}
                        {s.date && (
                          <p className="text-xs text-gray-400 mt-0.5">{s.date}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">
                  Dados fornecidos pelos Correios.{" "}
                  <a
                    href={`https://rastreamento.correios.com.br/app/index.php?numero=${resultado.codigo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-80 transition"
                    style={{ color: PINK }}
                  >
                    Ver no site oficial dos Correios
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-gray-100 border-t border-gray-200 py-6 px-6 text-center mt-8">
        <p className="text-gray-400 text-xs">{data.settings.footerCopyright}</p>
      </footer>
    </div>
  );
}
