import { useState } from "react";
import { Link } from "wouter";
import { User, Mail, Lock, LogOut, ChevronLeft, Eye, EyeOff, UserPlus } from "lucide-react";
import { useUser } from "@/context/UserContext";

const PINK = "#e8006f";

export default function Perfil() {
  const { currentUser, login, register, logout } = useUser();
  const [mode, setMode] = useState<"login" | "register">("login");

  if (currentUser) {
    return <ProfileView onLogout={logout} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#fdf0f6" }}>
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setMode("login")}
            className="flex-1 py-4 text-sm font-bold transition"
            style={mode === "login" ? { color: PINK, borderBottom: `2px solid ${PINK}` } : { color: "#9ca3af" }}>
            Entrar
          </button>
          <button
            onClick={() => setMode("register")}
            className="flex-1 py-4 text-sm font-bold transition"
            style={mode === "register" ? { color: PINK, borderBottom: `2px solid ${PINK}` } : { color: "#9ca3af" }}>
            Criar conta
          </button>
        </div>
        <div className="p-8">
          {mode === "login" ? <LoginForm onLogin={login} /> : <RegisterForm onRegister={register} />}
        </div>
        <div className="pb-6 text-center">
          <Link href="/">
            <button className="text-gray-400 text-xs hover:text-gray-600 transition flex items-center gap-1 mx-auto">
              <ChevronLeft size={13} /> Voltar ao site
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onLogin }: { onLogin: (email: string, pw: string) => boolean }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = onLogin(email, pw);
    if (!ok) {
      setError("E-mail ou senha incorretos.");
      setTimeout(() => setError(""), 3000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: PINK }}>
        <User size={26} className="text-white" />
      </div>
      <h2 className="text-xl font-black text-center text-gray-900 mb-5">Bem-vinda de volta!</h2>
      <div className="relative">
        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="email"
          placeholder="Seu Gmail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border-2 rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition border-gray-200 focus:border-pink-400"
        />
      </div>
      <div className="relative">
        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type={showPw ? "text" : "password"}
          placeholder="Senha"
          value={pw}
          onChange={e => setPw(e.target.value)}
          required
          className="w-full border-2 rounded-xl pl-9 pr-10 py-3 text-sm outline-none transition border-gray-200 focus:border-pink-400"
        />
        <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
      <button
        type="submit"
        className="w-full text-white font-bold rounded-xl py-3 text-sm hover:opacity-90 transition"
        style={{ background: PINK }}>
        Entrar
      </button>
    </form>
  );
}

function RegisterForm({ onRegister }: { onRegister: (name: string, email: string, pw: string) => { ok: boolean; error?: string } }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    const result = onRegister(name, email, pw);
    if (!result.ok) {
      setError(result.error ?? "Erro ao criar conta.");
      setTimeout(() => setError(""), 4000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: PINK }}>
        <UserPlus size={26} className="text-white" />
      </div>
      <h2 className="text-xl font-black text-center text-gray-900 mb-5">Criar conta</h2>
      <div className="relative">
        <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full border-2 rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition border-gray-200 focus:border-pink-400"
        />
      </div>
      <div className="relative">
        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="email"
          placeholder="Seu Gmail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border-2 rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition border-gray-200 focus:border-pink-400"
        />
      </div>
      <div className="relative">
        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type={showPw ? "text" : "password"}
          placeholder="Senha (mínimo 6 caracteres)"
          value={pw}
          onChange={e => setPw(e.target.value)}
          required
          className="w-full border-2 rounded-xl pl-9 pr-10 py-3 text-sm outline-none transition border-gray-200 focus:border-pink-400"
        />
        <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
      <button
        type="submit"
        className="w-full text-white font-bold rounded-xl py-3 text-sm hover:opacity-90 transition"
        style={{ background: PINK }}>
        Criar conta
      </button>
    </form>
  );
}

function ProfileView({ onLogout }: { onLogout: () => void }) {
  const { currentUser } = useUser();
  if (!currentUser) return null;

  const initials = currentUser.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const since = new Date(currentUser.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#fdf0f6" }}>
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-black"
          style={{ background: PINK }}>
          {initials}
        </div>
        <h2 className="font-black text-xl text-gray-900 mb-1">{currentUser.name}</h2>
        <p className="text-sm text-gray-400 mb-1">{currentUser.email}</p>
        <p className="text-xs text-gray-300 mb-8">Membro desde {since}</p>

        <div className="space-y-3">
          <Link href="/">
            <button className="w-full py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <ChevronLeft size={15} /> Voltar ao site
            </button>
          </Link>
          <button
            onClick={onLogout}
            className="w-full py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition flex items-center justify-center gap-2"
            style={{ background: PINK }}>
            <LogOut size={15} /> Sair da conta
          </button>
        </div>
      </div>
    </div>
  );
}
