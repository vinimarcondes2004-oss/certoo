import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "@/pages/Home";
import Produtos from "@/pages/Produtos";
import Categoria from "@/pages/Categoria";
import SobreNos from "@/pages/SobreNos";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/produtos" component={Produtos} />
      <Route path="/categoria/:slug" component={Categoria} />
      <Route path="/sobre-nos" component={SobreNos} />
      <Route path="*" component={Home} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
