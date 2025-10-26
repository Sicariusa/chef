import { useQuery, useMutation } from "convex/react";
import { api } from "../../ecommerce/convex/_generated/api";
import { toast } from "sonner";
import { useState } from "react";

interface CartPageProps {
  setCurrentPage: (page: string) => void;
}

export function CartPage({ setCurrentPage }: CartPageProps) {
  const cart = useQuery(api.cart.getCart);
  const removeFromCart = useMutation(api.cart.removeFromCart);
  const updateCartItem = useMutation(api.cart.updateCartItem);
  const placeOrder = useMutation(api.orders.placeOrder);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Fetch product details for each cart item
  const productQueries = (cart ?? []).map((item) =>
    useQuery(api.products.getProduct, { id: item.productId }),
  );

  const cartWithProducts = (cart ?? []).map((item, idx) => ({
    ...item,
    product: productQueries[idx],
  }));

  const total = cartWithProducts.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0,
  );

  // Loading state
  if (cart === undefined) {
    return (
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="skeleton h-10 w-48 mb-8 rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="skeleton h-24 w-24 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="skeleton h-6 w-3/4 mb-2 rounded"></div>
                    <div className="skeleton h-4 w-full mb-2 rounded"></div>
                    <div className="skeleton h-6 w-24 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="glass-strong p-6 rounded-2xl h-fit">
            <div className="skeleton h-8 w-40 mb-6 rounded"></div>
            <div className="space-y-3">
              <div className="skeleton h-6 w-full rounded"></div>
              <div className="skeleton h-6 w-full rounded"></div>
              <div className="skeleton h-12 w-full rounded mt-4"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const handleRemove = async (id: string) => {
    try {
      await removeFromCart({ id: id as any });
      toast.success("Item removed from cart");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove item");
    }
  };

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      await updateCartItem({ id: id as any, quantity });
    } catch (error: any) {
      toast.error(error.message || "Failed to update quantity");
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    try {
      const items = cartWithProducts.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.product?.price ?? 0,
      }));
      await placeOrder({ items, total });
      toast.success("Order placed successfully!");
      setCurrentPage("orders");
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="text-center py-16 sm:py-20 glass rounded-2xl p-8 animate-scale-in relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
          <div className="relative z-10">
            <div className="text-6xl sm:text-7xl mb-6 animate-bounce-custom">🛒</div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Your Cart is Empty
            </h1>
            <p className="text-white/70 mb-8 text-base sm:text-lg max-w-md mx-auto">
              Add some amazing products to your cart to get started!
            </p>
            <button
              onClick={() => setCurrentPage("home")}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:scale-105 smooth-transition hover:shadow-2xl hover:shadow-purple-500/50 font-semibold text-lg group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Start Shopping</span>
                <span className="group-hover:translate-x-1 smooth-transition">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 smooth-transition"></div>
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
          Shopping Cart
        </h1>
        <p className="text-white/70 text-sm sm:text-base">
          {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartWithProducts.map((item, index) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 glass rounded-2xl animate-fade-in-up card-hover group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative">
                <img
                  src={
                    item.product?.image ||
                    "https://via.placeholder.com/120?text=Product"
                  }
                  alt={item.product?.title}
                  className="w-full sm:w-28 h-32 sm:h-28 object-cover rounded-xl smooth-transition group-hover:scale-105 group-hover:shadow-lg"
                />
                {item.product?.stock && item.product.stock < 10 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse-custom">
                    Low Stock
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg sm:text-xl text-white mb-1 truncate">
                  {item.product?.title}
                </h3>
                <p className="text-white/60 text-xs sm:text-sm mb-3 line-clamp-2">
                  {item.product?.description}
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-purple-300 text-xl sm:text-2xl">
                    ${item.product?.price.toFixed(2)}
                  </p>
                  <span className="text-white/50 text-xs sm:text-sm">each</span>
                </div>
              </div>

              <div className="flex sm:flex-col justify-between sm:justify-between items-center sm:items-end gap-4">
                <button
                  onClick={() => handleRemove(item._id)}
                  className="text-red-400 hover:text-red-300 text-sm font-medium smooth-transition hover:scale-110 flex items-center gap-1 glass-dark px-3 py-2 rounded-lg"
                >
                  <span>🗑️</span>
                  <span>Remove</span>
                </button>

                <div className="flex items-center gap-2 glass-strong rounded-xl p-2">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="w-10 h-10 rounded-lg hover:bg-white/20 smooth-transition hover:scale-110 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-white font-bold text-lg">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item._id, item.quantity + 1)
                    }
                    className="w-10 h-10 rounded-lg hover:bg-white/20 smooth-transition hover:scale-110 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="glass-strong p-6 sm:p-8 rounded-2xl h-fit animate-fade-in-up sticky top-8 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-white/80 text-sm sm:text-base">
              <span>Subtotal ({cart.length} items)</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white/80 text-sm sm:text-base">
              <span>Shipping</span>
              <span className="font-semibold text-green-400">Free ✓</span>
            </div>
            <div className="flex justify-between text-white/80 text-sm sm:text-base">
              <span>Tax</span>
              <span className="font-semibold">Calculated at checkout</span>
            </div>

            <div className="border-t-2 border-white/30 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-white text-lg sm:text-xl font-medium">
                  Total
                </span>
                <span className="text-white text-2xl sm:text-3xl font-bold">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className={`w-full px-6 py-4 text-white rounded-xl font-bold text-base sm:text-lg smooth-transition relative overflow-hidden group ${
              isCheckingOut
                ? "bg-gray-500 cursor-not-allowed opacity-70"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
            }`}
          >
            {isCheckingOut ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Processing...
              </span>
            ) : (
              <>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>Proceed to Checkout</span>
                  <span className="group-hover:translate-x-1 smooth-transition">
                    →
                  </span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 smooth-transition"></div>
              </>
            )}
          </button>

          <div className="mt-4 text-center text-white/50 text-xs">
            🔒 Secure checkout • Free returns
          </div>
        </div>
      </div>
    </main>
  );
}
