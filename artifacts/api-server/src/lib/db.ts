import { supabase } from "./supabase";
import { withRetry } from "./retry";

const TABLE = "site_data";
const ORDERS_ROW = "orders";

export interface OrderItem {
  id: string;
  name: string;
  price: string;
  qty: number;
}

export interface Order {
  id: string;
  createdAt: string;
  status: "pendente" | "pago" | "cancelado";
  customer: { nome: string; email: string };
  address: {
    cep: string;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  items: OrderItem[];
  subtotal: number;
  frete: { valor: number; regiao: string; prazo: string; descricao: string };
  total: number;
  mpPreferenceId?: string;
  mpPaymentId?: string;
  paidAt?: string;
}

export async function getOrders(): Promise<Order[]> {
  return withRetry(
    async () => {
      const { data, error } = await supabase
        .from(TABLE)
        .select("data")
        .eq("id", ORDERS_ROW)
        .maybeSingle();
      if (error) throw Object.assign(new Error(error.message), { status: error.code ? 500 : undefined });
      if (!data) return [];
      return (data.data as { orders: Order[] }).orders || [];
    },
    { attempts: 3, delayMs: 400, label: "getOrders" }
  );
}

export async function saveOrders(orders: Order[]): Promise<void> {
  return withRetry(
    async () => {
      const { error } = await supabase.from(TABLE).upsert(
        { id: ORDERS_ROW, data: { orders }, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );
      if (error) throw Object.assign(new Error(error.message), { status: 500 });
    },
    { attempts: 4, delayMs: 500, label: "saveOrders" }
  );
}

export async function getSiteData(): Promise<unknown> {
  return withRetry(
    async () => {
      const { data, error } = await supabase
        .from(TABLE)
        .select("data")
        .eq("id", "main")
        .single();
      if (error) throw Object.assign(new Error(error.message), { status: 500 });
      return data?.data ?? null;
    },
    { attempts: 3, delayMs: 400, label: "getSiteData" }
  );
}

export async function saveSiteData(payload: unknown): Promise<void> {
  return withRetry(
    async () => {
      const { error } = await supabase
        .from(TABLE)
        .upsert(
          { id: "main", data: payload, updated_at: new Date().toISOString() },
          { onConflict: "id" }
        );
      if (error) throw Object.assign(new Error(error.message), { status: 500 });
    },
    { attempts: 4, delayMs: 500, label: "saveSiteData" }
  );
}
