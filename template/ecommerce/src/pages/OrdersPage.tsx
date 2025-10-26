import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function OrdersPage() {
  const orders = useQuery(api.orders.listOrdersForUser);

  // Loading state
  if (orders === undefined) {
    return (
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="skeleton h-10 w-48 mb-8 rounded-lg"></div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="space-y-2">
                  <div className="skeleton h-4 w-32 rounded"></div>
                  <div className="skeleton h-4 w-40 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="skeleton h-8 w-24 rounded"></div>
                  <div className="skeleton h-6 w-20 rounded ml-auto"></div>
                </div>
              </div>
              <div className="skeleton h-20 w-full rounded"></div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="text-center py-16 sm:py-20 glass rounded-2xl p-8 animate-scale-in relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
          <div className="relative z-10">
            <div className="text-6xl sm:text-7xl mb-6 animate-bounce-custom">📋</div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
              No Orders Yet
            </h1>
            <p className="text-white/70 text-base sm:text-lg mb-6 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your order history here!
            </p>
            <div className="inline-block glass-dark px-6 py-3 rounded-full">
              <span className="text-white/80 text-sm">Your orders will appear here</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "paid":
        return "✓";
      case "shipped":
        return "🚚";
      default:
        return "📦";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
      case "paid":
        return "bg-green-500/20 text-green-300 border-green-500/50";
      case "shipped":
        return "bg-blue-500/20 text-blue-300 border-blue-500/50";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/50";
    }
  };

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
          My Orders
        </h1>
        <p className="text-white/70 text-sm sm:text-base">
          Track and manage your order history
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order, index) => (
          <div
            key={order._id}
            className="glass rounded-2xl p-6 sm:p-8 animate-fade-in-up card-hover group relative overflow-hidden"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 smooth-transition"></div>

            <div className="relative z-10">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-white/50">Order ID:</span>
                    <code className="text-xs sm:text-sm text-white/70 bg-white/10 px-2 py-1 rounded font-mono">
                      {order._id.slice(-8)}
                    </code>
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm">
                    <span>📅</span>
                    <span>{new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2">
                  <div className="text-left sm:text-right">
                    <p className="text-xs sm:text-sm text-white/60 mb-1">Total Amount</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border smooth-transition ${getStatusColor(order.status)} ${
                      order.status === "pending" ? "animate-pulse-custom" : ""
                    }`}
                  >
                    <span>{getStatusIcon(order.status)}</span>
                    <span className="capitalize">{order.status}</span>
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 pt-6 border-t border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    Order Items
                  </h3>
                  <span className="text-xs text-white/60">
                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-xs sm:text-sm bg-white/10 rounded-xl p-3 sm:p-4 smooth-transition hover:bg-white/20 group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-lg">
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

              {/* Order Actions */}
              <div className="mt-6 pt-6 border-t border-white/20 flex flex-wrap gap-3">
                <button className="flex-1 sm:flex-none px-6 py-3 glass-dark rounded-xl text-white hover:bg-white/20 smooth-transition hover:scale-105 font-medium text-sm">
                  View Details
                </button>
                {order.status === "shipped" && (
                  <button className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white hover:scale-105 smooth-transition hover:shadow-lg hover:shadow-purple-500/50 font-medium text-sm">
                    Track Order
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
