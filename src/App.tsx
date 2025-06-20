
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";

const queryClient = new QueryClient();

// Direct imports without lazy loading
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import QuizCategory from "./pages/QuizCategory";
import QuizPlay from "./pages/QuizPlay";
import QuizResults from "./pages/QuizResults";
import Profile from "./pages/Profile";
import Billing from "./pages/Billing";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Admin Guard Component
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const isAdminAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword/>} />
               <Route path="/reset-password" element={<ResetPassword/>} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <AdminGuard>
                  <Admin />
                </AdminGuard>
              } />
              <Route path="/dashboard" element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              } />
              <Route path="/chat" element={
                <AuthGuard>
                  <Chat />
                </AuthGuard>
              } />
              <Route path="/chat/:conversationId" element={
                <AuthGuard>
                  <Chat />
                </AuthGuard>
              } />
              <Route path="/quiz/category/:category" element={
                <AuthGuard>
                  <QuizCategory />
                </AuthGuard>
              } />
              <Route path="/quiz/play" element={
                <AuthGuard>
                  <QuizPlay />
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
              <Route path="/profile" element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              } />
              <Route path="/billing" element={
                <AuthGuard>
                  <Billing />
                </AuthGuard>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
