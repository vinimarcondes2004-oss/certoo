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
  extraCategories?: string[];
  showInBestSellers?: boolean;
  extraImgs?: string[];
  description?: string;
  benefits?: string[];
  howToUse?: string;
  ingredients?: string;
  outOfStock?: boolean;
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

export interface MosaicPhoto {
  id: string;
  type?: "image" | "video";
  img: string;
  videoUrl?: string;
  big: boolean;
  aspectRatio?: string;
}

export interface CategoryCard {
  id: string;
  label: string;
  slug: string;
  img: string;
  color: string;
}

export interface EleganceBanner {
  img: string;
  tagline: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  buttonText: string;
}

export interface ResultadoMagic {
  title: string;
  subtitle: string;
  beforeImg: string;
  afterImg: string;
}

export interface SectionTitles {
  bestSellers: string;
  whoRecommends: string;
  whoUses: string;
  salonSection: string;
  salonSubtitle: string;
  faq: string;
  faqCta: string;
  faqCtaSubtitle: string;
  featuredTitle: string;
  featuredCategory: string;
}

export interface AboutValue {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export interface SobreNosPage {
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  highlight: string;
  paragraph1: string;
  paragraph2: string;
  finalMessage: string;
  ctaText: string;
  values: AboutValue[];
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
  column: "products" | "company" | "support";
}

export interface SectionConfig {
  id: string;
  label: string;
  visible: boolean;
}

export interface SiteSettings {
  siteName: string;
  logo: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  email: string;
  primaryColor: string;
  announcementText: string;
  announcementButton: string;
  footerAbout: string;
  footerCopyright: string;
  paymentMethods: string;
}

export interface SiteData {
  products: Product[];
  heroSlides: HeroSlide[];
  reviews: Review[];
  salonReviews: Review[];
  faqs: FaqItem[];
  mosaicPhotos: MosaicPhoto[];
  categoryCards: CategoryCard[];
  eleganceBanner: EleganceBanner;
  resultadoMagic: ResultadoMagic;
  sectionTitles: SectionTitles;
  sobreNos: SobreNosPage;
  footerLinks: FooterLink[];
  sectionLayout: SectionConfig[];
  settings: SiteSettings;
}

export const DEFAULT_SECTION_LAYOUT: SectionConfig[] = [
  { id: "hero",          label: "Hero / Slides",         visible: true },
  { id: "categories",   label: "Cards de Categoria",    visible: true },
  { id: "bestSellers",  label: "Mais Vendidos",          visible: true },
  { id: "mosaico",      label: "Mosaico 'Quem usa'",    visible: true },
  { id: "elegance",     label: "Banner Elegance",        visible: true },
  { id: "resultadoMagic", label: "Antes & Depois",      visible: true },
  { id: "reviews",      label: "Avaliações de Clientes", visible: true },
  { id: "featured",     label: "Vitrine de Produtos",   visible: true },
  { id: "salon",        label: "Seção Salões",           visible: true },
  { id: "faq",          label: "FAQ",                    visible: true },
];

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
  mosaicPhotos: [
    { id: "1", img: "mosaic-hair.jpg", big: true },
    { id: "2", img: "mosaic-hair-2.jpg", big: false },
    { id: "3", img: "mosaic-hair-3.webp", big: false },
    { id: "4", img: "mosaic-hair-6.jpg", big: false },
    { id: "5", img: "mosaic-hair-5.jpg", big: false },
  ],
  categoryCards: [
    { id: "1", label: "Shampoo e máscara", slug: "shampoo-e-mascara", img: "product-pos-quimica.png", color: "#d0eaf8" },
    { id: "2", label: "Reparador de pontas", slug: "reparador-de-pontas", img: "product-oil-repair.png", color: "#d5f0e0" },
    { id: "3", label: "Progressiva sem formol", slug: "progressiva-sem-formol", img: "product-progressiva.png", color: "#fde8f0" },
    { id: "4", label: "Finalizadores", slug: "finalizadores", img: "product-finalizador-liss.png", color: "#fce4ec" },
  ],
  eleganceBanner: {
    img: "product-oil-repair-colorful.png",
    tagline: "A elegância que",
    title: "seus fios",
    titleHighlight: "merecem",
    subtitle: "Cabelos lindos • Fios saudáveis • Resultado garantido",
    buttonText: "Descubra Agora",
  },
  resultadoMagic: {
    title: "Resultado Magic",
    subtitle: "Veja a transformação real",
    beforeImg: "before-hair.jpg",
    afterImg: "after-hair.jpg",
  },
  sectionTitles: {
    bestSellers: "Mais Vendidos",
    whoRecommends: "Quem usa Profissional recomenda",
    whoUses: "Quem usa Profissional recomenda! 💖",
    salonSection: "Profissional a queridinha dos salões ♥",
    salonSubtitle: "Profissionais que confiam na qualidade Profissional",
    faq: "FAQ",
    faqCta: "Ficou alguma dúvida?",
    faqCtaSubtitle: "Nossa equipe está disponível para te ajudar segunda a sexta, das 8h às 18h.",
    featuredTitle: "Kits",
    featuredCategory: "kits",
  },
  sobreNos: {
    heroTagline: "Sobre nós",
    heroTitle: "Cuidado que vai além da estética",
    heroSubtitle: "É sobre autoestima, confiança e bem-estar em todos os momentos do seu dia.",
    highlight: "autoestima, confiança e bem-estar",
    paragraph1: "Somos apaixonados por transformar rotinas simples em experiências incríveis. Por isso, desenvolvemos produtos pensados para todos os tipos de cabelo, unindo tecnologia, qualidade profissional e resultados reais que você pode ver e sentir.",
    paragraph2: "Nossa missão é levar até você o cuidado que antes só existia nos salões, de forma prática, acessível e eficaz. Cada fórmula é criada com atenção aos detalhes, para entregar brilho, maciez e saúde aos seus fios.",
    finalMessage: "Aqui, cada cliente é única — e o seu cabelo merece esse cuidado especial. ✨",
    ctaText: "Conheça nossos produtos",
    values: [
      { id: "1", icon: "🌿", title: "Qualidade", desc: "Fórmulas com ingredientes selecionados e tecnologia profissional." },
      { id: "2", icon: "💚", title: "Acessibilidade", desc: "O melhor cuidado ao alcance de todas as mulheres." },
      { id: "3", icon: "✨", title: "Resultado", desc: "Brilho, maciez e saúde visíveis desde a primeira aplicação." },
    ],
  },
  footerLinks: [
    { id: "1", label: "Shampoos", href: "/categoria/shampoo-e-mascara", column: "products" },
    { id: "2", label: "Máscaras", href: "/categoria/mascaras", column: "products" },
    { id: "3", label: "Reparador de pontas", href: "/categoria/reparador-de-pontas", column: "products" },
    { id: "4", label: "Kits", href: "/categoria/kits", column: "products" },
    { id: "5", label: "Sobre nós", href: "/sobre-nos", column: "company" },
    { id: "6", label: "Rastrear pedido", href: "/rastrear-pedido", column: "support" },
  ],
  sectionLayout: DEFAULT_SECTION_LAYOUT,
  settings: {
    siteName: "PR Profissional",
    logo: "logo-pr.png",
    whatsapp: "5511953770968",
    instagram: "",
    facebook: "",
    email: "Prprofissional0111@gmail.com",
    primaryColor: "#e8006f",
    announcementText: "Pegue instantaneamente • Proteja os fios • Resultados visíveis",
    announcementButton: "APROVEITE AGORA!",
    footerAbout: "A marca favorita de quem cuida do cabelo com amor e dedicação.",
    footerCopyright: "© 2026 Profissional. Todos os direitos reservados.",
    paymentMethods: "Visa,Master,Pix,Boleto",
  },
};

const STORAGE_KEY = "pr_site_data";
const PASSWORD_KEY = "pr_admin_password";

export function mergeWithDefaults(parsed: Partial<SiteData>): SiteData {
  return {
    ...defaultSiteData,
    ...parsed,
    settings: { ...defaultSiteData.settings, ...(parsed.settings ?? {}) },
    sectionTitles: { ...defaultSiteData.sectionTitles, ...(parsed.sectionTitles ?? {}) },
    eleganceBanner: { ...defaultSiteData.eleganceBanner, ...(parsed.eleganceBanner ?? {}) },
    resultadoMagic: { ...defaultSiteData.resultadoMagic, ...(parsed.resultadoMagic ?? {}) },
    sobreNos: {
      ...defaultSiteData.sobreNos,
      ...(parsed.sobreNos ?? {}),
      values: parsed.sobreNos?.values ?? defaultSiteData.sobreNos.values,
    },
    mosaicPhotos: Array.isArray(parsed.mosaicPhotos) ? parsed.mosaicPhotos : defaultSiteData.mosaicPhotos,
    categoryCards: Array.isArray(parsed.categoryCards) ? parsed.categoryCards : defaultSiteData.categoryCards,
    footerLinks: Array.isArray(parsed.footerLinks) ? parsed.footerLinks : defaultSiteData.footerLinks,
    sectionLayout: (() => {
      if (!Array.isArray(parsed.sectionLayout) || parsed.sectionLayout.length === 0) {
        return defaultSiteData.sectionLayout;
      }
      const savedIds = new Set(parsed.sectionLayout.map((s: SectionConfig) => s.id));
      const missing = DEFAULT_SECTION_LAYOUT.filter(s => !savedIds.has(s.id));
      if (missing.length === 0) return parsed.sectionLayout as SectionConfig[];
      const result: SectionConfig[] = [...parsed.sectionLayout as SectionConfig[]];
      for (const sec of missing) {
        const defIdx = DEFAULT_SECTION_LAYOUT.findIndex(s => s.id === sec.id);
        const nextExisting = DEFAULT_SECTION_LAYOUT.slice(defIdx + 1).find(s => savedIds.has(s.id));
        if (nextExisting) {
          const insertAt = result.findIndex(s => s.id === nextExisting.id);
          result.splice(insertAt, 0, sec);
        } else {
          result.push(sec);
        }
      }
      return result;
    })(),
  };
}

export function loadSiteData(): SiteData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return mergeWithDefaults(JSON.parse(raw) as Partial<SiteData>);
    }
  } catch {}
  return defaultSiteData;
}

export function saveSiteData(data: SiteData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage quota exceeded (e.g. large video uploads) — safe to ignore,
    // the database is the authoritative source of truth.
  }
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
