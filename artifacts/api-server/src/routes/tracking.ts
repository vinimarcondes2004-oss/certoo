import { Router } from "express";

const router = Router();

interface CorreiosEvento {
  codigo?: string;
  tipo?: string;
  descricao?: string;
  dtHrCriado?: string;
  unidade?: {
    nome?: string;
    tipo?: { nome?: string };
    endereco?: { municipio?: string; uf?: string };
  };
  detalhe?: string;
}

interface CorreiosObjeto {
  numero?: string;
  evento?: CorreiosEvento[];
  tipoPostal?: { descricao?: string };
  dtPrevista?: string;
}

function formatarDataHora(dtHr: string): string {
  if (!dtHr) return "";
  try {
    const d = new Date(dtHr);
    if (isNaN(d.getTime())) return dtHr;
    const data = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
    const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return `${data} às ${hora}`;
  } catch {
    return dtHr.slice(0, 10);
  }
}

function formatarDataPrevisao(dtHr: string): string {
  if (!dtHr) return "";
  try {
    const d = new Date(dtHr);
    if (isNaN(d.getTime())) return dtHr;
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return dtHr;
  }
}

function mapEvento(ev: CorreiosEvento, index: number) {
  const cidade = ev.unidade?.endereco?.municipio ?? "";
  const uf = ev.unidade?.endereco?.uf ?? "";
  const local = cidade && uf ? `${cidade}/${uf}` : cidade || uf || "";

  const partes = [ev.detalhe, local].filter(Boolean);
  const desc = partes.join(" — ");

  return {
    step: ev.descricao ?? "Evento",
    desc,
    date: formatarDataHora(ev.dtHrCriado ?? ""),
    done: true,
    active: index === 0,
  };
}

/**
 * GET /rastrear?codigo=AA000000000BR
 *
 * Consulta o rastreamento de um objeto nos Correios.
 */
router.get("/rastrear", async (req, res) => {
  const { codigo } = req.query as { codigo?: string };

  if (!codigo || codigo.trim().length < 8) {
    return res.status(400).json({ error: "Código de rastreamento inválido." });
  }

  const codigoLimpo = codigo.trim().toUpperCase().replace(/\s/g, "");

  let correiosData: Record<string, unknown>;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const correiosRes = await fetch(
      `https://proxyapp.correios.com.br/v1/sro-rastro/${codigoLimpo}`,
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; RastreioApp/1.0)",
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    const text = await correiosRes.text();
    try {
      correiosData = JSON.parse(text);
    } catch {
      if (correiosRes.status === 403 || correiosRes.status === 401) {
        return res.status(503).json({
          error: "Os Correios bloquearam a consulta temporariamente. Tente novamente em alguns minutos.",
        });
      }
      return res.status(502).json({
        error: "Resposta inválida dos Correios. Tente novamente.",
      });
    }
  } catch (err: any) {
    if (err.name === "AbortError") {
      return res.status(504).json({ error: "Os Correios demoraram a responder. Tente novamente." });
    }
    console.error("Erro ao consultar Correios:", err.message);
    return res.status(502).json({
      error: "Não foi possível consultar os Correios no momento. Tente novamente em instantes.",
    });
  }

  const objetos = (correiosData as { objeto?: CorreiosObjeto[]; objetos?: CorreiosObjeto[] })?.objeto
    ?? (correiosData as { objetos?: CorreiosObjeto[] })?.objetos
    ?? [];

  const objeto: CorreiosObjeto | null = Array.isArray(objetos) && objetos.length > 0
    ? objetos[0]
    : null;

  if (!objeto || !Array.isArray(objeto.evento) || objeto.evento.length === 0) {
    const msgs = (correiosData as { msgs?: string[] })?.msgs ?? [];
    const causa = (correiosData as { causa?: string })?.causa ?? "";
    const motivo = msgs.filter(Boolean).join(" ") || causa || "";

    return res.status(404).json({
      error: motivo
        ? `Objeto não encontrado: ${motivo}`
        : "Objeto não encontrado. Verifique o código e tente novamente. O objeto pode ainda não ter sido postado ou o código pode estar incorreto.",
    });
  }

  const steps = objeto.evento.map((ev, i) => mapEvento(ev, i));

  return res.json({
    codigo: codigoLimpo,
    produto: objeto.tipoPostal?.descricao ?? "Encomenda",
    previsao: objeto.dtPrevista ? formatarDataPrevisao(objeto.dtPrevista) : null,
    steps,
  });
});

export default router;
