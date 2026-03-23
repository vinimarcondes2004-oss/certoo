import dotenv from "dotenv";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: join(process.cwd(), ".env"), override: true });
dotenv.config({ path: join(process.cwd(), "artifacts/api-server", ".env"), override: true });

const supabaseUrl = process.env["SUPABASE_URL"];
const supabaseKey = process.env["SUPABASE_KEY"];

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_KEY environment variables are required.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
