import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { CartPage } from "./pages/CartPage";
import { OrdersPage } from "./pages/OrdersPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Toaster } from "sonner";
import { useState } from "react";
import type { Id } from "../convex/_generated/dataModel";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [selectedProductId, setSelectedProductId] =
    useState<Id<"products"> | null>(null);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--gray-50)" }}>
      <Authenticated>
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main style={{ flex: 1 }}>
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
        <div className="flex items-center justify-center" style={{ flex: 1, padding: "32px" }}>
          <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
            <div className="auth-form">
              <div className="text-center mb-xl">
                <h1 style={{ fontSize: "3rem", fontWeight: 700, color: "var(--primary)", marginBottom: "16px" }}>
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
