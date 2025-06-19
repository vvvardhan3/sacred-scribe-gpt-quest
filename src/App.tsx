
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const queryClient = new QueryClient();

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Chat = lazy(() => import("./pages/Chat"));
const QuizCategory = lazy(() => import("./pages/QuizCategory"));
const QuizPlay = lazy(() => import("./pages/QuizPlay"));
const QuizResults = lazy(() => import("./pages/QuizResults"));
const Profile = lazy(() => import("./pages/Profile"));
const Billing = lazy(() => import("./pages/Billing"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
            <Suspense fallback={<LoadingSkeleton />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
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
                <Route path="/quiz/results" element={
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
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
