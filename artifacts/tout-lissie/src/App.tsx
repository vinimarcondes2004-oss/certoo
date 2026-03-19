import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SiteProvider } from "@/context/SiteContext";
import Home from "@/pages/Home";
import Produtos from "@/pages/Produtos";
import Categoria from "@/pages/Categoria";
import SobreNos from "@/pages/SobreNos";
import RastrearPedido from "@/pages/RastrearPedido";
import Admin from "@/pages/Admin";
import Produto from "@/pages/Produto";

const queryClient = new QueryClient();

const ALL_IMAGES = [
  "hero-bg.jpg",
  "hero-bg-2.jpg",
  "hero-bg-3.jpg",
  "logo-pr.png",
  "product-progressiva.png",
  "product-pos-quimica.png",
  "product-hidratacao.png",
  "product-reparador-pontas.png",
  "product-finalizador-liss.png",
  "product-megaliss.png",
  "product-oil-repair-colorful.png",
  "product-oil-repair.png",
  "mosaic-hair.jpg",
  "mosaic-hair-2.jpg",
  "mosaic-hair-3.webp",
  "mosaic-hair-5.jpg",
  "mosaic-hair-6.jpg",
  "avatar-1.jpg",
  "avatar-2.jpg",
  "avatar-3.jpg",
  "avatar-4.jpg",
  "avatar-5.jpg",
  "avatar-6.jpg",
  "avatar-7.jpg",
  "avatar-8.jpg",
  "before-hair.jpg",
  "after-hair.jpg",
];

function useImagePreloader() {
  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    ALL_IMAGES.forEach((name) => {
      const img = new Image();
      img.src = `${base}${name}`;
    });
  }, []);
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route path="/" component={Home} />
      <Route path="/produtos" component={Produtos} />
      <Route path="/categoria/:slug" component={Categoria} />
      <Route path="/produto/:id" component={Produto} />
      <Route path="/sobre-nos" component={SobreNos} />
      <Route path="/rastrear-pedido" component={RastrearPedido} />
      <Route path="*" component={Home} />
    </Switch>
    </>
  );
}

function App() {
  useImagePreloader();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
      </SiteProvider>
    </QueryClientProvider>
  );
}

export default App;
