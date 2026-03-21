import { Router } from "express";

const router = Router();

/**
 * Tabela de frete por estado (UF) calculada a partir de São Paulo / SP.
 * Valores baseados em médias de transportadoras (PAC/Sedex) para pacotes de até 1kg.
 * Ordenados por distância/dificuldade de entrega.
 */
const TABELA_FRETE: Record<string, { valor: number; regiao: string; prazo: string }> = {
  // --- Sudeste (origem/vizinhança imediata) ---
  SP: { valor: 19.90,  regiao: "São Paulo",        prazo: "3 a 5 dias úteis"  },
  MG: { valor: 22.90,  regiao: "Minas Gerais",     prazo: "3 a 5 dias úteis"  },
  RJ: { valor: 24.90,  regiao: "Rio de Janeiro",   prazo: "4 a 6 dias úteis"  },
  ES: { valor: 26.90,  regiao: "Espírito Santo",   prazo: "4 a 6 dias úteis"  },

  // --- Sul ---
  PR: { valor: 27.90,  regiao: "Paraná",           prazo: "4 a 7 dias úteis"  },
  SC: { valor: 31.90,  regiao: "Santa Catarina",   prazo: "5 a 8 dias úteis"  },
  RS: { valor: 35.90,  regiao: "Rio Grande do Sul", prazo: "6 a 9 dias úteis" },

  // --- Centro-Oeste ---
  MS: { valor: 34.90,  regiao: "Mato Grosso do Sul", prazo: "5 a 8 dias úteis" },
  GO: { valor: 37.90,  regiao: "Goiás",            prazo: "6 a 9 dias úteis"  },
  DF: { valor: 37.90,  regiao: "Distrito Federal", prazo: "6 a 9 dias úteis"  },
  MT: { valor: 42.90,  regiao: "Mato Grosso",      prazo: "7 a 10 dias úteis" },

  // --- Nordeste (por distância crescente de SP) ---
  BA: { valor: 44.90,  regiao: "Bahia",            prazo: "7 a 10 dias úteis" },
  SE: { valor: 47.90,  regiao: "Sergipe",          prazo: "8 a 11 dias úteis" },
  AL: { valor: 48.90,  regiao: "Alagoas",          prazo: "8 a 11 dias úteis" },
  PE: { valor: 49.90,  regiao: "Pernambuco",       prazo: "8 a 12 dias úteis" },
  PB: { valor: 51.90,  regiao: "Paraíba",          prazo: "9 a 12 dias úteis" },
  RN: { valor: 52.90,  regiao: "Rio Grande do Norte", prazo: "9 a 13 dias úteis" },
  CE: { valor: 53.90,  regiao: "Ceará",            prazo: "9 a 13 dias úteis" },
  PI: { valor: 55.90,  regiao: "Piauí",            prazo: "10 a 14 dias úteis" },
  MA: { valor: 57.90,  regiao: "Maranhão",         prazo: "10 a 15 dias úteis" },

  // --- Norte ---
  TO: { valor: 52.90,  regiao: "Tocantins",        prazo: "9 a 13 dias úteis" },
  PA: { valor: 59.90,  regiao: "Pará",             prazo: "10 a 15 dias úteis" },
  RO: { valor: 62.90,  regiao: "Rondônia",         prazo: "11 a 16 dias úteis" },
  AC: { valor: 67.90,  regiao: "Acre",             prazo: "13 a 19 dias úteis" },
  AM: { valor: 69.90,  regiao: "Amazonas",         prazo: "13 a 20 dias úteis" },
  AP: { valor: 72.90,  regiao: "Amapá",            prazo: "14 a 20 dias úteis" },
  RR: { valor: 74.90,  regiao: "Roraima",          prazo: "15 a 22 dias úteis" },
};

/**
 * GET /frete?cep=XXXXXXXX&uf=SP
 *
 * Calcula o frete a partir de São Paulo/SP para o estado de destino (uf).
 * Retorna valor do frete, região, prazo e descrição.
 */
router.get("/frete", async (req, res) => {
  try {
    const { cep, uf } = req.query as { cep?: string; uf?: string };

    if (!cep) {
      return res.status(400).json({ error: "CEP não informado" });
    }

    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      return res.status(400).json({ error: "CEP inválido. Informe 8 dígitos." });
    }

    let ufDestino = uf?.trim().toUpperCase() ?? "";

    // Se o UF não foi enviado pelo frontend, consulta o ViaCEP para obtê-lo
    if (!ufDestino) {
      try {
        const viaCepRes = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const viaCep = await viaCepRes.json();
        if (viaCep.uf) ufDestino = viaCep.uf.toUpperCase();
      } catch {
        // Ignora erros de rede e usa fallback abaixo
      }
    }

    // Busca na tabela por UF
    if (ufDestino && TABELA_FRETE[ufDestino]) {
      const { valor, regiao, prazo } = TABELA_FRETE[ufDestino];
      return res.json({
        cep: cepLimpo,
        uf: ufDestino,
        regiao,
        valorFrete: valor,
        prazo,
        descricao: `Entrega para ${regiao} — ${prazo}`,
      });
    }

    // Fallback final: UF desconhecido
    if (ufDestino) {
      return res.status(400).json({
        error: `Estado "${ufDestino}" não encontrado na tabela. Verifique o CEP informado.`,
      });
    }

    // Fallback por primeiro dígito do CEP (quando ViaCEP também falhou)
    const d = parseInt(cepLimpo[0], 10);
    let valorFrete: number, regiaoLabel: string, prazo: string;
    if      (d <= 1) { valorFrete = 19.90; regiaoLabel = "Sudeste";       prazo = "3 a 5 dias úteis"; }
    else if (d <= 3) { valorFrete = 29.90; regiaoLabel = "Sul/Sudeste";   prazo = "4 a 7 dias úteis"; }
    else if (d <= 5) { valorFrete = 37.90; regiaoLabel = "Centro-Oeste";  prazo = "6 a 9 dias úteis"; }
    else if (d <= 7) { valorFrete = 52.90; regiaoLabel = "Nordeste";      prazo = "9 a 13 dias úteis"; }
    else             { valorFrete = 64.90; regiaoLabel = "Norte";         prazo = "12 a 20 dias úteis"; }

    return res.json({
      cep: cepLimpo,
      regiao: regiaoLabel,
      valorFrete,
      prazo,
      descricao: `Entrega para ${regiaoLabel} — ${prazo}`,
    });

  } catch (err: any) {
    console.error("Erro no cálculo de frete:", err.message);
    return res.status(500).json({ error: "Erro ao calcular frete" });
  }
});

export default router;
