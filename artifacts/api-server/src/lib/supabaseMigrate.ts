import { supabase } from "./supabase";

export async function ensureContentTable() {
  const { error } = await supabase.from("content").select("id").limit(1);

  if (error && error.code === "PGRST205") {
    console.warn(
      "\n⚠️  Supabase: tabela 'content' não encontrada.\n" +
      "Execute o seguinte SQL no Supabase Dashboard → SQL Editor:\n\n" +
      "  CREATE TABLE IF NOT EXISTS public.content (\n" +
      "    id INTEGER PRIMARY KEY,\n" +
      "    title TEXT NOT NULL DEFAULT '',\n" +
      "    description TEXT NOT NULL DEFAULT '',\n" +
      "    image TEXT NOT NULL DEFAULT '',\n" +
      '    "buttonText" TEXT NOT NULL DEFAULT \'\'\n' +
      "  );\n" +
      "  INSERT INTO public.content (id, title, description, image, \"buttonText\")\n" +
      "  VALUES (1, 'Bem-vindo!', 'Edite pelo painel admin.', '', 'Saiba Mais')\n" +
      "  ON CONFLICT (id) DO NOTHING;\n"
    );
    return false;
  }

  if (!error) {
    console.log("[Supabase] Tabela 'content' encontrada e acessível.");
    return true;
  }

  console.error("[Supabase] Erro ao verificar tabela:", error);
  return false;
}
