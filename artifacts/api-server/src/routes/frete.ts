import { Router } from "express";

const router = Router();

/**
 * Tabela de frete por estado (UF) com base nas regiões do Brasil.
 * Os valores refletem distância real de entrega a partir do eixo Sul/Sudeste.
 *
 * Zona 1 — Sudeste     (SP, RJ, MG, ES):               R$ 15,00
 * Zona 2 — Sul         (PR, SC, RS):                    R$ 20,00
 * Zona 3 — Centro-Oeste (GO, DF, MT, MS):               R$ 25,00
 * Zona 4 — Nordeste    (BA, SE, AL, PE, PB, RN, CE, PI, MA): R$ 30,00
 * Zona 5 — Norte       (PA, AM, RR, AP, AC, RO, TO):    R$ 40,00
 */
const ZONAS: {
  estados: string[];
  valor: number;
  regiao: string;
  prazo: string;
}[] = [
  {
    estados: ["SP", "RJ", "MG", "ES"],
    valor: 15,
    regiao: "Sudeste",
    prazo: "3 a 5 dias úteis",
  },
  {
    estados: ["PR", "SC", "RS"],
    valor: 20,
    regiao: "Sul",
    prazo: "4 a 6 dias úteis",
  },
  {
    estados: ["GO", "DF", "MT", "MS"],
    valor: 25,
    regiao: "Centro-Oeste",
    prazo: "5 a 7 dias úteis",
  },
  {
    estados: ["BA", "SE", "AL", "PE", "PB", "RN", "CE", "PI", "MA"],
    valor: 30,
    regiao: "Nordeste",
    prazo: "6 a 9 dias úteis",
  },
  {
    estados: ["PA", "AM", "RR", "AP", "AC", "RO", "TO"],
    valor: 40,
    regiao: "Norte",
    prazo: "8 a 12 dias úteis",
  },
];

/**
 * Encontra a zona de frete pelo estado (UF).
 * Retorna null se o UF não for reconhecido.
 */
function encontrarZona(uf: string) {
  const ufNorm = uf.trim().toUpperCase();
  return ZONAS.find(z => z.estados.includes(ufNorm)) ?? null;
}

/**
 * GET /frete?cep=XXXXXXXX&uf=SP
 *
 * Calcula o frete com base no estado (UF) do endereço.
 * O parâmetro `uf` é obrigatório para cálculo preciso por região.
 * Se apenas `cep` for enviado (sem `uf`), usa o primeiro dígito como fallback.
 */
router.get("/frete", (req, res) => {
  try {
    const { cep, uf } = req.query as { cep?: string; uf?: string };

    if (!cep) {
      return res.status(400).json({ error: "CEP não informado" });
    }

    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      return res.status(400).json({ error: "CEP inválido. Informe 8 dígitos." });
    }

    // --- Cálculo por UF (preciso) ---
    if (uf) {
      const zona = encontrarZona(uf);

      if (!zona) {
        return res.status(400).json({
          error: `Estado "${uf.toUpperCase()}" não reconhecido. Verifique o CEP.`,
        });
      }

      return res.json({
        cep: cepLimpo,
        uf: uf.trim().toUpperCase(),
        regiao: zona.regiao,
        valorFrete: zona.valor,
        prazo: zona.prazo,
        descricao: `Entrega para ${zona.regiao} (${zona.prazo})`,
      });
    }

    // --- Fallback por primeiro dígito do CEP (quando UF não disponível) ---
    const primeiroDigito = parseInt(cepLimpo[0], 10);
    let valorFrete: number;
    let regiaoLabel: string;
    let prazo: string;

    if (primeiroDigito <= 1) {
      valorFrete = 15; regiaoLabel = "Sudeste"; prazo = "3 a 5 dias úteis";
    } else if (primeiroDigito <= 3) {
      valorFrete = 20; regiaoLabel = "Sul/Sudeste"; prazo = "4 a 6 dias úteis";
    } else if (primeiroDigito <= 5) {
      valorFrete = 25; regiaoLabel = "Centro-Oeste"; prazo = "5 a 7 dias úteis";
    } else if (primeiroDigito <= 7) {
      valorFrete = 30; regiaoLabel = "Nordeste"; prazo = "6 a 9 dias úteis";
    } else {
      valorFrete = 40; regiaoLabel = "Norte"; prazo = "8 a 12 dias úteis";
    }

    return res.json({
      cep: cepLimpo,
      regiao: regiaoLabel,
      valorFrete,
      prazo,
      descricao: `Entrega para ${regiaoLabel} (${prazo})`,
    });
  } catch (err: any) {
    console.error("Erro no cálculo de frete:", err.message);
    return res.status(500).json({ error: "Erro ao calcular frete" });
  }
});

export default router;
