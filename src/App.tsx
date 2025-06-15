
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthGuard } from "./components/AuthGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Billing from "./pages/Billing";
import QuizCategory from "./pages/QuizCategory";
import QuizPlay from "./pages/QuizPlay";
import QuizResults from "./pages/QuizResults";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
            <Route path="/profile" element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            } />
            <Route path="/notifications" element={
              <AuthGuard>
                <Notifications />
              </AuthGuard>
            } />
            <Route path="/billing" element={
              <AuthGuard>
                <Billing />
              </AuthGuard>
            } />
            <Route path="/quiz/category/:category" element={
              <AuthGuard>
                <QuizCategory />
              </AuthGuard>
            } />
            <Route path="/quiz/play/:quizId" element={
              <AuthGuard>
                <QuizPlay />
              </AuthGuard>
            } />
            <Route path="/quiz/results/:progressId" element={
              <AuthGuard>
                <QuizResults />
              </AuthGuard>
            } />
            <Route path="/chat" element={
              <AuthGuard>
                <Chat />
              </AuthGuard>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
