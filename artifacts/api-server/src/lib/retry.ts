const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { attempts?: number; delayMs?: number; label?: string } = {}
): Promise<T> {
  const { attempts = 3, delayMs = 400, label = "operação" } = options;
  let lastErr: any;

  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastErr = err;
      const retriable =
        err?.status == null ||
        RETRYABLE_STATUS.has(err.status) ||
        err.code === "ECONNRESET" ||
        err.code === "ECONNREFUSED" ||
        err.code === "ETIMEDOUT" ||
        err.message?.includes("network") ||
        err.message?.includes("timeout") ||
        err.message?.includes("fetch");

      if (!retriable) {
        console.error(`[Retry] ${label} falhou com erro não-retriável: ${err.message}`);
        throw err;
      }

      if (i < attempts) {
        const wait = delayMs * Math.pow(2, i - 1);
        console.warn(`[Retry] ${label} — tentativa ${i}/${attempts} falhou, aguardando ${wait}ms... (${err.message})`);
        await new Promise(r => setTimeout(r, wait));
      }
    }
  }

  console.error(`[Retry] ${label} falhou após ${attempts} tentativas.`);
  throw lastErr;
}

export function withTimeout<T>(promise: Promise<T>, ms: number, label = "operação"): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`[Timeout] ${label} excedeu ${ms}ms sem resposta`)),
        ms
      )
    ),
  ]);
}
