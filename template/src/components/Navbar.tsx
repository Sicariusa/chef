import { useQuery } from "convex/react";
import { api } from "../../ecommerce/convex/_generated/api";
import { SignOutButton } from "../SignOutButton";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../i18n";

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const role = useQuery(api.roles.getMyRole);
  const cart = useQuery(api.cart.getCart) ?? [];
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-10 glass-strong border-b shadow-lg transition-shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentPage("home")}
            className="text-2xl font-bold text-white hover:text-primary-hover smooth-transition animate-fade-in"
          >
            🛒 Chef Store
          </button>
          <nav className="flex gap-2">
            <button
              onClick={() => setCurrentPage("home")}
              className={`px-4 py-2 rounded-lg smooth-transition ${
                currentPage === "home"
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                  : "text-white hover:bg-white/20 hover:scale-105"
              }`}
            >
              {t("navbar.shop")}
            </button>
            <button
              onClick={() => setCurrentPage("cart")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 smooth-transition relative ${
                currentPage === "cart"
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                  : "text-white hover:bg-white/20 hover:scale-105"
              }`}
            >
              {t("navbar.cart")}
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs animate-bounce-custom">
                  {cart.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentPage("orders")}
              className={`px-4 py-2 rounded-lg smooth-transition ${
                currentPage === "orders"
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                  : "text-white hover:bg-white/20 hover:scale-105"
              }`}
            >
              {t("navbar.orders")}
            </button>
            {role === "admin" && (
              <button
                onClick={() => setCurrentPage("admin")}
                className={`px-4 py-2 rounded-lg smooth-transition ${
                  currentPage === "admin"
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                    : "text-white hover:bg-white/20 hover:scale-105"
                }`}
              >
                {t("navbar.admin")}
              </button>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="glass-dark px-4 py-2 rounded-lg text-white hover:bg-white/20 smooth-transition font-semibold"
          >
            {language === "en" ? "العربية" : "English"}
          </button>
          {loggedInUser && (
            <span className="text-sm text-white/90">
              {loggedInUser.email || "Guest"}
            </span>
          )}
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
