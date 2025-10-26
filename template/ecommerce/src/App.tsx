import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../ecommerce/convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { CartPage } from "./pages/CartPage";
import { OrdersPage } from "./pages/OrdersPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import type { Id } from "../ecommerce/convex/_generated/dataModel";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [selectedProductId, setSelectedProductId] =
    useState<Id<"products"> | null>(null);
  const setMyRole = useMutation(api.roles.setMyRole);

  // Set role from localStorage after authentication
  useEffect(() => {
    const pendingRole = localStorage.getItem("pendingRole");
    if (pendingRole) {
      const role = pendingRole as "user" | "admin";
      void setMyRole({ role }).then(() => {
        localStorage.removeItem("pendingRole");
      });
    }
  }, [setMyRole]);

  return (
    <div className="min-h-screen flex flex-col">
      <Authenticated>
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="flex-1">
          {currentPage === "home" && (
            <HomePage
              setCurrentPage={setCurrentPage}
              setSelectedProductId={setSelectedProductId}
            />
          )}
          {currentPage === "cart" && (
            <CartPage setCurrentPage={setCurrentPage} />
          )}
          {currentPage === "orders" && <OrdersPage />}
          {currentPage === "admin" && <AdminDashboard />}
        </main>
      </Authenticated>

      <Unauthenticated>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md mx-auto">
            <div className="flex flex-col gap-section">
              <div className="text-center">
                <h1 className="text-5xl font-bold text-primary mb-4">
                  🛒 Chef Store
                </h1>
                <p className="text-xl text-secondary">
                  Sign in to start shopping
                </p>
              </div>
              <SignInForm />
            </div>
          </div>
        </div>
      </Unauthenticated>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
