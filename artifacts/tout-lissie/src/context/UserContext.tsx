import { createContext, useContext, useState, ReactNode } from "react";
import { getUsers, saveUsers, generateId, UserAccount } from "@/lib/siteData";

interface UserContextType {
  currentUser: UserAccount | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const raw = sessionStorage.getItem("user_session");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  function login(email: string, password: string): boolean {
    const users = getUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      sessionStorage.setItem("user_session", JSON.stringify(user));
      setCurrentUser(user);
      return true;
    }
    return false;
  }

  function register(name: string, email: string, password: string): { ok: boolean; error?: string } {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "Este e-mail já está cadastrado." };
    }
    const newUser: UserAccount = {
      id: generateId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    sessionStorage.setItem("user_session", JSON.stringify(newUser));
    setCurrentUser(newUser);
    return { ok: true };
  }

  function logout() {
    sessionStorage.removeItem("user_session");
    setCurrentUser(null);
  }

  return (
    <UserContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
