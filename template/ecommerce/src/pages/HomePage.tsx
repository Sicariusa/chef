import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ProductCard } from "../components/ProductCard";
import type { Id } from "../../convex/_generated/dataModel";

interface HomePageProps {
  setCurrentPage: (page: string) => void;
  setSelectedProductId: (id: Id<"products"> | null) => void;
}

export function HomePage({
  setCurrentPage,
  setSelectedProductId,
}: HomePageProps) {
  const products = useQuery(api.products.listProducts);

  const handleViewDetails = (productId: Id<"products">) => {
    setSelectedProductId(productId);
    setCurrentPage("product");
  };

  // Loading state with skeleton
  if (products === undefined) {
    return (
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="glass-strong rounded-2xl p-6 sm:p-8 lg:p-10 mb-8 animate-fade-in-up">
          <div className="skeleton h-12 w-3/4 mb-4 rounded-lg"></div>
          <div className="skeleton h-6 w-1/2 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-4 animate-pulse">
              <div className="skeleton h-48 w-full mb-4 rounded-xl"></div>
              <div className="skeleton h-6 w-3/4 mb-2 rounded"></div>
              <div className="skeleton h-4 w-full mb-3 rounded"></div>
              <div className="skeleton h-8 w-1/3 rounded"></div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Hero Section */}
      <div className="glass-strong rounded-2xl p-6 sm:p-8 lg:p-10 mb-8 animate-fade-in-up relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 smooth-transition"></div>
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-shimmer">
            Welcome to Chef Store
          </h1>
          <p className="text-white/90 text-base sm:text-lg lg:text-xl font-light tracking-wide">
            Discover amazing products at great prices! ✨
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="glass-dark px-4 py-2 rounded-full animate-fade-in-up">
              <span className="text-white/80 text-sm">🚀 Fast Shipping</span>
            </div>
            <div className="glass-dark px-4 py-2 rounded-full animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <span className="text-white/80 text-sm">💎 Premium Quality</span>
            </div>
            <div className="glass-dark px-4 py-2 rounded-full animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <span className="text-white/80 text-sm">🔒 Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      {products.length === 0 ? (
        <div className="text-center py-16 sm:py-20 glass rounded-2xl p-8 animate-scale-in relative overflow-hidden">
          <div className="absolute inset-0 glow-effect opacity-30"></div>
          <div className="relative z-10">
            <div className="text-6xl sm:text-7xl mb-6 animate-bounce-custom">📦</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              No Products Yet
            </h2>
            <p className="text-white/70 text-base sm:text-lg mb-6 max-w-md mx-auto">
              Our shelves are being stocked! Check back soon for amazing products.
            </p>
            <div className="inline-block glass-dark px-6 py-3 rounded-full animate-pulse-custom">
              <span className="text-white/80 text-sm">Coming Soon...</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Featured Products
              <span className="ml-3 text-sm font-normal glass-dark px-3 py-1 rounded-full text-white/80">
                {products.length} items
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 stagger-children">
            {products.map((product, index) => (
              <div
                key={product._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard
                  product={product}
                  onViewDetails={handleViewDetails}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
