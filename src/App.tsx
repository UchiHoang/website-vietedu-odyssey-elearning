import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Lessons from "./pages/Lessons";
import Auth from "./pages/Auth";
import TrangQuynhGame from "./pages/TrangQuynhGame";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import SongHongGame from "./pages/SongHongGame";
import PreschoolGame from "./pages/PreschoolGame";
import Grade1Game from "./pages/Grade1Game";
import Grade3Game from "./pages/Grade3Game";
import Grade4Game from "./pages/Grade4Game";
import Grade5Game from "./pages/Grade5Game";
import DataPage from "./pages/data";


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
          <Route path="/profile" element={<Profile />} />
                    <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/classroom/trangquynh" element={<TrangQuynhGame />} />
          <Route path="/classroom/songhong" element={<SongHongGame />} />
          <Route path="/classroom/preschool" element={<PreschoolGame />} />
          <Route path="/classroom/grade1" element={<Grade1Game />} />
          <Route path="/classroom/grade3" element={<Grade3Game />} />
          <Route path="/classroom/grade4" element={<Grade4Game />} />
          <Route path="/classroom/grade5" element={<Grade5Game />} />
          <Route path="/data" element={<DataPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
