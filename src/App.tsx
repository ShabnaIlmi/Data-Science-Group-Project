
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ImporterRisk from "./pages/ImporterRisk";
import EndUserRisk from "./pages/EndUserRisk";
import RecipeRisk from "./pages/RecipeRisk";
import FutureRisk from "./pages/FutureRisk";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/importer-risk" element={<ImporterRisk />} />
          <Route path="/end-user-risk" element={<EndUserRisk />} />
          <Route path="/recipe-risk" element={<RecipeRisk />} />
          <Route path="/future-risk" element={<FutureRisk />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
