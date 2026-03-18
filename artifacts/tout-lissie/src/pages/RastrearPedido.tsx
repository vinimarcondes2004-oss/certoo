import { useState } from "react";
import { Link } from "wouter";

type Status = {
  step: string;
  desc: string;
  date: string;
  done: boolean;
  active: boolean;
};

const mockOrders: Record<string, { produto: string; previsao: string; steps: Status[] }> = {
  "PF-10234": {
    produto: "Máscara Hidratação Profunda 500g",
    previsao: "20/03/2026",
    steps: [
      { step: "Pedido confirmado", desc: "Seu pagamento foi aprovado.", date: "15/03/2026 - 10:32", done: true, active: false },
      { step: "Em separação", desc: "Estamos preparando seu pedido.", date: "15/03/2026 - 14:00", done: true, active: false },
      { step: "Enviado", desc: "Seu pedido saiu para entrega.", date: "16/03/2026 - 09:15", done: true, active: true },
      { step: "Saiu para entrega", desc: "O entregador está a caminho.", date: "", done: false, active: false },
      { step: "Entregue", desc: "Pedido entregue com sucesso.", date: "", done: false, active: false },
    ],
  },
  "PF-99871": {
    produto: "Shampoo Reconstrução 400ml",
    previsao: "22/03/2026",
    steps: [
      { step: "Pedido confirmado", desc: "Seu pagamento foi aprovado.", date: "17/03/2026 - 08:10", done: true, active: false },
      { step: "Em separação", desc: "Estamos preparando seu pedido.", date: "", done: false, active: true },
      { step: "Enviado", desc: "Seu pedido saiu para entrega.", date: "", done: false, active: false },
      { step: "Saiu para entrega", desc: "O entregador está a caminho.", date: "", done: false, active: false },
      { step: "Entregue", desc: "Pedido entregue com sucesso.", date: "", done: false, active: false },
    ],
  },
};

export default function RastrearPedido() {
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState<null | typeof mockOrders[string]>(null);
  const [erro, setErro] = useState(false);

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    const chave = codigo.trim().toUpperCase();
    if (mockOrders[chave]) {
      setResultado(mockOrders[chave]);
      setErro(false);
    } else {
      setResultado(null);
      setErro(true);
    }
  }

  const currentStep = resultado ? resultado.steps.findIndex(s => s.active) : -1;
  const progress = resultado
    ? Math.round(((resultado.steps.filter(s => s.done).length) / resultado.steps.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 transition">← Voltar</Link>
          <span className="text-gray-300">|</span>
          <span className="font-bold text-gray-800 text-lg tracking-tight">Profissional</span>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a5c2e] to-[#2e7d44] text-white py-14 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white/60 text-sm uppercase tracking-widest mb-3">Suporte</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Rastrear pedido</h1>
          <p className="text-white/75 text-base">Digite o código do seu pedido para acompanhar a entrega em tempo real.</p>
        </div>
      </section>

      {/* Formulário */}
      <section className="py-12 px-6">
        <div className="max-w-xl mx-auto">
          <form onSubmit={buscar} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Código do pedido
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={codigo}
                onChange={e => { setCodigo(e.target.value); setErro(false); setResultado(null); }}
                placeholder="Ex: PF-10234"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c2e]/30 focus:border-[#1a5c2e]"
              />
              <button
                type="submit"
                className="bg-[#1a5c2e] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#14492a] transition text-sm"
              >
                Buscar
              </button>
            </div>
            {erro && (
              <p className="mt-3 text-sm text-red-500">
                Código não encontrado. Verifique e tente novamente.
              </p>
            )}
            <p className="mt-3 text-xs text-gray-400">
              Você encontra o código do pedido no e-mail de confirmação da compra.
            </p>
          </form>

          {/* Resultado */}
          {resultado && (
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
              {/* Info do pedido */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Pedido</p>
                  <p className="font-bold text-gray-800">{codigo.toUpperCase()}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{resultado.produto}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Previsão de entrega</p>
                  <p className="font-semibold text-[#1a5c2e]">{resultado.previsao}</p>
                </div>
              </div>

              {/* Barra de progresso */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progresso</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-[#1a5c2e] h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-0">
                {resultado.steps.map((s, i) => {
                  const isLast = i === resultado.steps.length - 1;
                  return (
                    <div key={i} className="flex gap-4">
                      {/* Ícone */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 text-xs font-bold
                          ${s.active ? "border-[#1a5c2e] bg-[#1a5c2e] text-white" :
                            s.done ? "border-[#1a5c2e] bg-[#d5f0e0] text-[#1a5c2e]" :
                            "border-gray-200 bg-white text-gray-300"}`}>
                          {s.done ? "✓" : i + 1}
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 flex-1 my-1 ${s.done ? "bg-[#1a5c2e]" : "bg-gray-200"}`} style={{ minHeight: 28 }} />
                        )}
                      </div>
                      {/* Texto */}
                      <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                        <p className={`font-semibold text-sm ${s.active ? "text-[#1a5c2e]" : s.done ? "text-gray-800" : "text-gray-300"}`}>
                          {s.step}
                          {s.active && <span className="ml-2 text-xs bg-[#d5f0e0] text-[#1a5c2e] px-2 py-0.5 rounded-full">Atual</span>}
                        </p>
                        <p className={`text-xs mt-0.5 ${s.done || s.active ? "text-gray-500" : "text-gray-300"}`}>{s.desc}</p>
                        {s.date && <p className="text-xs text-gray-400 mt-0.5">{s.date}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer simples */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6 px-6 text-center mt-8">
        <p className="text-gray-400 text-xs">© 2026 Profissional. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
