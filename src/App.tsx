import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Lessons from "./pages/Lessons";
import Auth from "./pages/Auth";
import TrangQuynhGame from "./pages/TrangQuynhGame";
import SongHongGame from "./pages/SongHongGame";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import PreschoolGame from "./pages/PreschoolGame";
import Grade1Game from "./pages/Grade1Game";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/classroom/trangquynh" element={<TrangQuynhGame />} />
          <Route path="/classroom/songhong" element={<SongHongGame />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/classroom/preschool" element={<PreschoolGame />} />
          <Route path="/classroom/grade1" element={<Grade1Game />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
