export interface Product {
  id: string;
  name: string;
  ml: string;
  price: string;
  old: string;
  stars: number;
  badge: string;
  img: string;
  category: string;
  categoryLabel: string;
  color: string;
}

export interface HeroSlide {
  id: string;
  img: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface Review {
  id: string;
  name: string;
  img: string;
  stars: number;
  text: string;
  date: string;
  role?: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface SiteSettings {
  siteName: string;
  whatsapp: string;
  email: string;
  primaryColor: string;
  announcementText: string;
  footerAbout: string;
}

export interface SiteData {
  products: Product[];
  heroSlides: HeroSlide[];
  reviews: Review[];
  salonReviews: Review[];
  faqs: FaqItem[];
  settings: SiteSettings;
}

export const defaultSiteData: SiteData = {
  products: [
    { id: "1", name: "Progressiva sem formol", ml: "1L", price: "R$ 170,00", old: "R$ 250,00", stars: 5, badge: "Mais Vendido", img: "product-progressiva.png", category: "progressiva-sem-formol", categoryLabel: "Progressiva", color: "#e8006f" },
    { id: "2", name: "Shampoo e máscara pós química", ml: "300ml", price: "R$ 80,00", old: "R$ 120,00", stars: 5, badge: "Top", img: "product-pos-quimica.png", category: "shampoo-e-mascara", categoryLabel: "Shampoos", color: "#4a90e2" },
    { id: "3", name: "Shampoo e máscara de hidratação", ml: "300ml", price: "R$ 80,00", old: "R$ 120,00", stars: 5, badge: "Favorito", img: "product-hidratacao.png", category: "shampoo-e-mascara", categoryLabel: "Máscaras", color: "#ff6b6b" },
    { id: "4", name: "Reparador de pontas", ml: "30ml", price: "R$ 45,00", old: "R$ 54,90", stars: 4, badge: "Novo", img: "product-reparador-pontas.png", category: "reparador-de-pontas", categoryLabel: "Finalizadores", color: "#43a047" },
    { id: "5", name: "Kit com shampoo máscara e Liven", ml: "300ml", price: "R$ 150,00", old: "R$ 219,90", stars: 5, badge: "Destaque", img: "product-finalizador-liss.png", category: "shampoo-e-mascara", categoryLabel: "Kits", color: "#8e24aa" },
  ],
  heroSlides: [
    { id: "1", img: "hero-bg.jpg", title: "Perfeito para\ntodas as horas\ndo seu dia", subtitle: "SMASH, IMEDIATAMENTE", buttonText: "APROVEITE AGORA!" },
    { id: "2", img: "hero-bg-2.jpg", title: "Perfeito para\ntodas as horas\ndo seu dia", subtitle: "SMASH, IMEDIATAMENTE", buttonText: "APROVEITE AGORA!" },
    { id: "3", img: "hero-bg-3.jpg", title: "Perfeito para\ntodas as horas\ndo seu dia", subtitle: "SMASH, IMEDIATAMENTE", buttonText: "APROVEITE AGORA!" },
  ],
  reviews: [
    { id: "1", name: "Fernanda K.", img: "avatar-1.jpg", stars: 5, text: "Incrível! Meu cabelo ficou liso, brilhoso e saudável desde a primeira aplicação.", date: "15 mar 2026" },
    { id: "2", name: "Beatriz S.", img: "avatar-2.jpg", stars: 5, text: "A máscara é um milagre! Nunca vi resultado tão rápido e duradouro.", date: "12 mar 2026" },
    { id: "3", name: "Priscila A.", img: "avatar-3.jpg", stars: 5, text: "O finalizador deixa o cabelo com um brilho incomparável. Recomendo!", date: "10 mar 2026" },
    { id: "4", name: "Renata M.", img: "avatar-4.jpg", stars: 5, text: "Uso toda a linha e meu cabelo nunca esteve tão saudável.", date: "8 mar 2026" },
  ],
  salonReviews: [
    { id: "1", name: "Ana C.", img: "avatar-5.jpg", stars: 5, text: "Meus clientes amam os resultados! Uso Profissional em todos os atendimentos.", role: "Cabeleireira profissional" },
    { id: "2", name: "Mariana T.", img: "avatar-6.jpg", stars: 5, text: "A linha é perfeita para cabelos difíceis. Resultados surpreendentes!", role: "Salão de Beleza SP" },
    { id: "3", name: "Renata P.", img: "avatar-7.jpg", stars: 5, text: "Qualidade profissional a um preço acessível. Super recomendo!", role: "Hair Stylist" },
    { id: "4", name: "Luana B.", img: "avatar-8.jpg", stars: 5, text: "Desde que comecei a usar Profissional, minhas clientes voltam sempre!", role: "Salão Chic RJ" },
  ],
  faqs: [
    { id: "1", q: "Como usar o shampoo Profissional?", a: "Aplique sobre os cabelos molhados, massageie o couro cabeludo por 2 a 3 minutos e enxágue bem." },
    { id: "2", q: "Os produtos são para todos os tipos de cabelo?", a: "Sim! A linha foi desenvolvida para atender todos os tipos de cabelo." },
    { id: "3", q: "Qual o prazo de entrega?", a: "Em geral entregamos em 2 a 7 dias úteis. Pedidos acima de R$150 têm frete grátis." },
    { id: "4", q: "Posso trocar ou devolver?", a: "Sim! Oferecemos 30 dias para troca ou devolução sem complicação." },
    { id: "5", q: "Os produtos são testados em animais?", a: "Não! Somos 100% cruelty-free." },
  ],
  settings: {
    siteName: "PR Profissional",
    whatsapp: "5511953770968",
    email: "Prprofissional0111@gmail.com",
    primaryColor: "#e8006f",
    announcementText: "Pegue instantaneamente • Proteja os fios • Resultados visíveis",
    footerAbout: "A marca favorita de quem cuida do cabelo com amor e dedicação.",
  },
};

const STORAGE_KEY = "pr_site_data";
const PASSWORD_KEY = "pr_admin_password";

export function loadSiteData(): SiteData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SiteData;
      return { ...defaultSiteData, ...parsed };
    }
  } catch {}
  return defaultSiteData;
}

export function saveSiteData(data: SiteData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getAdminPassword(): string {
  return localStorage.getItem(PASSWORD_KEY) ?? "admin123";
}

export function setAdminPassword(pw: string) {
  localStorage.setItem(PASSWORD_KEY, pw);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}
