import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function AdminDashboard() {
  const role = useQuery(api.roles.getMyRole);
  const products = useQuery(api.products.listProducts);
  const orders = useQuery(api.orders.listAllOrders);
  const createProduct = useMutation(api.products.createProduct);
  const updateProduct = useMutation(api.products.updateProduct);
  const deleteProduct = useMutation(api.products.deleteProduct);
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);

  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: 0,
    image: "",
    stock: 10,
  });
  const [isCreating, setIsCreating] = useState(false);

  // Loading state
  if (role === undefined || products === undefined || orders === undefined) {
    return (
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="skeleton h-10 w-64 mb-8 rounded-lg"></div>
        <div className="flex gap-4 mb-8">
          <div className="skeleton h-12 w-40 rounded-xl"></div>
          <div className="skeleton h-12 w-40 rounded-xl"></div>
        </div>
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="skeleton h-8 w-48 mb-6 rounded"></div>
          <div className="space-y-4">
            <div className="skeleton h-12 w-full rounded"></div>
            <div className="skeleton h-24 w-full rounded"></div>
            <div className="skeleton h-12 w-full rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  if (role !== "admin") {
    return (
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="text-center py-16 sm:py-20 glass rounded-2xl p-8 animate-scale-in relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10"></div>
          <div className="relative z-10">
            <div className="text-6xl sm:text-7xl mb-6 animate-bounce-custom">🔒</div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Access Denied
            </h1>
            <p className="text-white/70 text-base sm:text-lg mb-6 max-w-md mx-auto">
              You don't have permission to access the admin dashboard.
            </p>
            <div className="inline-block glass-dark px-6 py-3 rounded-full">
              <span className="text-white/80 text-sm">Admin privileges required</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createProduct(newProduct);
      toast.success("Product created successfully! 🎉");
      setNewProduct({
        title: "",
        description: "",
        price: 0,
        image: "",
        stock: 10,
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create product");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct({ id: id as any });
      toast.success("Product deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  const handleUpdatePrice = async (id: string, newPrice: number) => {
    try {
      await updateProduct({ id: id as any, price: newPrice });
      toast.success("Price updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update price");
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      await updateOrderStatus({ id: id as any, status });
      toast.success("Order status updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update order status");
    }
  };

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">👑</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-white/70 text-sm sm:text-base">
          Manage products, orders, and store settings
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <div className="glass-strong rounded-2xl p-6 card-hover group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 smooth-transition"></div>
          <div className="relative z-10">
            <p className="text-white/70 text-sm mb-1">Total Products</p>
            <p className="text-3xl font-bold text-white">{products.length}</p>
          </div>
          <div className="absolute bottom-2 right-2 text-5xl opacity-10">📦</div>
        </div>
        <div className="glass-strong rounded-2xl p-6 card-hover group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 smooth-transition"></div>
          <div className="relative z-10">
            <p className="text-white/70 text-sm mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-white">{orders.length}</p>
          </div>
          <div className="absolute bottom-2 right-2 text-5xl opacity-10">📋</div>
        </div>
        <div className="glass-strong rounded-2xl p-6 card-hover group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 smooth-transition"></div>
          <div className="relative z-10">
            <p className="text-white/70 text-sm mb-1">Revenue</p>
            <p className="text-3xl font-bold text-white">
              ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
            </p>
          </div>
          <div className="absolute bottom-2 right-2 text-5xl opacity-10">💰</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <button
          onClick={() => setActiveTab("products")}
          className={`flex-1 sm:flex-none px-6 py-4 rounded-xl font-bold smooth-transition relative overflow-hidden group ${
            activeTab === "products"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/50"
              : "glass text-white hover:bg-white/20"
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span>📦</span>
            <span>Products</span>
            <span className="hidden sm:inline glass-dark px-2 py-1 rounded-full text-xs">
              {products.length}
            </span>
          </span>
          {activeTab === "products" && (
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 animate-shimmer"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex-1 sm:flex-none px-6 py-4 rounded-xl font-bold smooth-transition relative overflow-hidden group ${
            activeTab === "orders"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/50"
              : "glass text-white hover:bg-white/20"
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span>📋</span>
            <span>Orders</span>
            <span className="hidden sm:inline glass-dark px-2 py-1 rounded-full text-xs">
              {orders.length}
            </span>
          </span>
          {activeTab === "orders" && (
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 animate-shimmer"></div>
          )}
        </button>
      </div>

      {activeTab === "products" ? (
        <div className="animate-fade-in">
          {/* Create Product Form */}
          <div className="glass-strong rounded-2xl p-6 sm:p-8 mb-8 animate-fade-in-up relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 smooth-transition"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">✨</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Create New Product
                </h2>
              </div>
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Product Title *</label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    value={newProduct.title}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, title: e.target.value })
                    }
                    className="w-full px-4 py-3 glass-dark rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 smooth-transition"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Description *</label>
                  <textarea
                    placeholder="Describe your product..."
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, description: e.target.value })
                    }
                    className="w-full px-4 py-3 glass-dark rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 smooth-transition resize-none"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm font-medium">Price ($) *</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newProduct.price || ""}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 glass-dark rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 smooth-transition"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm font-medium">Stock *</label>
                    <input
                      type="number"
                      placeholder="10"
                      value={newProduct.stock || ""}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          stock: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 glass-dark rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 smooth-transition"
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm font-medium">Image URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newProduct.image}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, image: e.target.value })
                      }
                      className="w-full px-4 py-3 glass-dark rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 smooth-transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreating}
                  className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base smooth-transition relative overflow-hidden group ${
                    isCreating
                      ? "bg-gray-500 cursor-not-allowed opacity-70"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
                  }`}
                >
                  {isCreating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Creating...
                    </span>
                  ) : (
                    <>
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <span>✨</span>
                        <span>Create Product</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 smooth-transition"></div>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Products List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4 animate-fade-in-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                <span>📦</span>
                <span>All Products</span>
              </h2>
              <span className="glass-dark px-4 py-2 rounded-full text-white/80 text-sm">
                {products.length} total
              </span>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12 glass rounded-2xl p-8">
                <div className="text-5xl mb-4">📦</div>
                <p className="text-white/70">No products yet. Create your first product above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product, index) => (
                  <div
                    key={product._id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 glass rounded-2xl animate-fade-in-up card-hover group"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-white mb-1 truncate">
                        {product.title}
                      </h3>
                      <p className="text-sm text-white/60 line-clamp-2 mb-2">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-white/50">
                        <span className="glass-dark px-2 py-1 rounded">
                          Stock: {product.stock}
                        </span>
                        <span className="glass-dark px-2 py-1 rounded">
                          ID: {product._id.slice(-6)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="flex items-center gap-2 flex-1 sm:flex-none">
                        <span className="text-white text-sm font-medium">$</span>
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) =>
                            handleUpdatePrice(
                              product._id,
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-24 px-3 py-2 glass-strong rounded-lg text-white font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 smooth-transition"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 hover:scale-105 smooth-transition font-medium text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <span>📋</span>
              <span>All Orders</span>
            </h2>
            <span className="glass-dark px-4 py-2 rounded-full text-white/80 text-sm">
              {orders.length} total
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 glass rounded-2xl p-8">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-white/70">No orders yet. Orders will appear here once customers start purchasing!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div
                  key={order._id}
                  className="p-6 sm:p-8 glass rounded-2xl animate-fade-in-up card-hover group relative overflow-hidden"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 smooth-transition"></div>

                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                      {/* Order Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/50">Order ID:</span>
                          <code className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded font-mono">
                            {order._id.slice(-8)}
                          </code>
                        </div>
                        <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm">
                          <span>👤</span>
                          <span>Customer: {order.userId.slice(-6)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm">
                          <span>📅</span>
                          <span>
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Order Status & Total */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3">
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-white/60 mb-1">Total Amount</p>
                          <p className="text-2xl sm:text-3xl font-bold text-white">
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order._id, e.target.value)
                          }
                          className="px-4 py-2 glass-strong rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 smooth-transition cursor-pointer hover:bg-white/20"
                        >
                          <option value="pending" className="bg-gray-800">⏳ Pending</option>
                          <option value="paid" className="bg-gray-800">✓ Paid</option>
                          <option value="shipped" className="bg-gray-800">🚚 Shipped</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="pt-6 border-t border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-white text-sm sm:text-base">
                          Order Items
                        </h4>
                        <span className="text-xs text-white/60">
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center text-xs sm:text-sm bg-white/10 rounded-xl p-3 sm:p-4 smooth-transition hover:bg-white/20"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-lg">
                                📦
                              </div>
                              <div>
                                <p className="text-white/90 font-medium">
                                  Product #{item.productId.slice(-6)}
                                </p>
                                <p className="text-white/50 text-xs">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-bold">
                                ${item.priceAtPurchase.toFixed(2)}
                              </p>
                              <p className="text-white/50 text-xs">each</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
