import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useState } from "react";
import type { Id } from "../../convex/_generated/dataModel";

interface CartPageProps {
  setCurrentPage: (page: string) => void;
}

export function CartPage({ setCurrentPage }: CartPageProps) {
  const cart = useQuery(api.cart.getCart) ?? [];
  const removeFromCart = useMutation(api.cart.removeFromCart);
  const updateCartItem = useMutation(api.cart.updateCartItem);
  const placeOrder = useMutation(api.orders.placeOrder);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [removingItems, setRemovingItems] = useState<Set<Id<"cart">>>(new Set());

  // Fetch product details for each cart item
  const productQueries = cart.map((item) =>
    useQuery(api.products.getProduct, { id: item.productId }),
  );

  const cartWithProducts = cart.map((item, idx) => ({
    ...item,
    product: productQueries[idx],
  }));

  const total = cartWithProducts.reduce(
    (sum, item) => {
      if (!item) return sum;
      return sum + (item.product?.price ?? 0) * item.quantity;
    },
    0,
  );

  const handleRemove = async (id: Id<"cart">) => {
    const idSet = new Set(removingItems);
    idSet.add(id);
    setRemovingItems(idSet);
    try {
      await removeFromCart({ id });
      toast.success("Item removed from cart");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove item");
    } finally {
      const idSet = new Set(removingItems);
      idSet.delete(id);
      setRemovingItems(idSet);
    }
  };

  const handleUpdateQuantity = async (id: Id<"cart">, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateCartItem({ id, quantity });
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
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-20">
            <div className="animate-bounce mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Let's find something amazing!
            </p>
            <button
              onClick={() => setCurrentPage("home")}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review your items before checkout</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartWithProducts.map((item, index) => {
              if (!item) return null;
              return (
                <div
                  key={item._id}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md ${
                    removingItems.has(item._id) ? 'opacity-50 scale-95' : 'animate-fade-in-up'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={
                        item.product?.image ||
                        "https://via.placeholder.com/120x120?text=Product"
                      }
                      alt={item.product?.title}
                      className="w-24 h-24 object-cover rounded-lg shadow-sm"
                    />
                    {item.product?.stock && item.product.stock < 10 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Low Stock
                      </div>
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">
                      {item.product?.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.product?.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-blue-600">
                        ${item.product?.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        each
                      </span>
                    </div>
                  </div>
                  
                  {/* Quantity Controls & Actions */}
                  <div className="flex flex-col justify-between items-end">
                    <button
                      onClick={() => handleRemove(item._id)}
                      disabled={removingItems.has(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                    >
                      {removingItems.has(item._id) ? 'Removing...' : 'Remove'}
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      
                      <span className="w-12 text-center font-semibold text-lg">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="text-right mt-2">
                      <div className="text-lg font-bold text-gray-800">
                        ${((item.product?.price ?? 0) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-xl font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || cart.length === 0}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isCheckingOut ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setCurrentPage("home")}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Continue Shopping
                </button>
              </div>
              
              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
