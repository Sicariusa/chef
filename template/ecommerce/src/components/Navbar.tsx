import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignOutButton } from "../SignOutButton";

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const cart = useQuery(api.cart.getCart) ?? [];

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <div className="flex items-center gap-lg">
            <button
              onClick={() => setCurrentPage("home")}
              className="nav-brand"
            >
              🛒 Chef Store
            </button>
            <ul className="nav-menu">
              <li>
                <button
                  onClick={() => setCurrentPage("home")}
                  className={`nav-link ${currentPage === "home" ? "active" : ""}`}
                >
                  Shop
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage("cart")}
                  className={`nav-link ${currentPage === "cart" ? "active" : ""}`}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  Cart
                  {cart.length > 0 && (
                    <span className="badge badge-error" style={{padding: "2px 8px"}}>
                      {cart.length}
                    </span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage("orders")}
                  className={`nav-link ${currentPage === "orders" ? "active" : ""}`}
                >
                  My Orders
                </button>
              </li>
              {loggedInUser?.role === "admin" && (
                <li>
                  <button
                    onClick={() => setCurrentPage("admin")}
                    className={`nav-link ${currentPage === "admin" ? "active" : ""}`}
                  >
                    Admin Dashboard
                  </button>
                </li>
              )}
            </ul>
          </div>
          <div className="flex items-center gap-md">
            {loggedInUser && (
              <span className="text-sm text-secondary">
                {loggedInUser.email || "Guest"}
              </span>
            )}
            <SignOutButton />
          </div>
        </nav>
      </div>
    </header>
  );
}
