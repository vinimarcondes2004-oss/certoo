import { pool } from "./index";

export async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "site_data" (
      "id" text PRIMARY KEY DEFAULT 'main',
      "data" jsonb NOT NULL,
      "updated_at" timestamptz DEFAULT now()
    );
  `);
}
