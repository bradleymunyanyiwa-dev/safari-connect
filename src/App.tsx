import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import Index from "./pages/Index.tsx";
import Scouting from "./pages/Scouting.tsx";
import Auth from "./pages/Auth.tsx";
import Pay from "./pages/Pay.tsx";
import GuidePending from "./pages/GuidePending.tsx";
import GuideProfile from "./pages/GuideProfile.tsx";
import Guides from "./pages/Guides.tsx";
import GuideDetail from "./pages/GuideDetail.tsx";
import RequestTrip from "./pages/RequestTrip.tsx";
import MyTrips from "./pages/MyTrips.tsx";
import TripMessages from "./pages/TripMessages.tsx";
import AdminGuides from "./pages/AdminGuides.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/:id" element={<GuideDetail />} />
            <Route path="/guides/:id/request" element={<RequireAuth roles={["client"]}><RequestTrip /></RequireAuth>} />
            <Route path="/my-trips" element={<RequireAuth><MyTrips /></RequireAuth>} />
            <Route path="/trips/:id/messages" element={<RequireAuth><TripMessages /></RequireAuth>} />
            <Route path="/pay" element={<RequireAuth><Pay /></RequireAuth>} />
            <Route path="/guide-pending" element={<RequireAuth><GuidePending /></RequireAuth>} />
            <Route path="/guide-profile" element={<RequireAuth roles={["guide"]}><GuideProfile /></RequireAuth>} />
            <Route path="/scouting" element={<RequireAuth requirePaid><Scouting /></RequireAuth>} />
            <Route path="/admin/guides" element={<RequireAuth roles={["admin"]}><AdminGuides /></RequireAuth>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
