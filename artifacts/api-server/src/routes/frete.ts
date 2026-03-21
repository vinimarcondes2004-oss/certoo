import { Router } from "express";

const router = Router();

/**
 * Rota GET /frete?cep=XXXXXXXX
 * Calcula o valor do frete com base no primeiro dígito do CEP:
 *   0-3 → R$ 15,00
 *   4-7 → R$ 20,00
 *   8-9 → R$ 25,00
 */
router.get("/frete", (req, res) => {
  try {
    const { cep } = req.query as { cep?: string };

    if (!cep) {
      return res.status(400).json({ error: "CEP não informado" });
    }

    // Remove traços e espaços, mantém apenas dígitos
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      return res.status(400).json({ error: "CEP inválido. Informe 8 dígitos." });
    }

    // Determina o frete pelo primeiro dígito do CEP
    const primeiroDigito = parseInt(cepLimpo[0], 10);

    let valorFrete: number;
    let regiaoLabel: string;

    if (primeiroDigito <= 3) {
      // CEPs de 0 a 3 — região Sul/Sudeste próximo
      valorFrete = 15;
      regiaoLabel = "Sul/Sudeste";
    } else if (primeiroDigito <= 7) {
      // CEPs de 4 a 7 — região Centro-Oeste/Nordeste
      valorFrete = 20;
      regiaoLabel = "Centro-Oeste/Nordeste";
    } else {
      // CEPs 8 e 9 — região Norte/extremo Sul
      valorFrete = 25;
      regiaoLabel = "Norte/Sul Extremo";
    }

    return res.json({
      cep: cepLimpo,
      valorFrete,
      regiaoLabel,
      descricao: `Entrega para ${regiaoLabel}`,
    });
  } catch (err: any) {
    console.error("Erro no cálculo de frete:", err.message);
    return res.status(500).json({ error: "Erro ao calcular frete" });
  }
});

export default router;
