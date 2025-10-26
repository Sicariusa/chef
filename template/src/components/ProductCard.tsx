import { useMutation } from "convex/react";
import { api } from "../../ecommerce/convex/_generated/api";
import { toast } from "sonner";
import type { Id } from "../../ecommerce/convex/_generated/dataModel";

interface Product {
  _id: Id<"products">;
  title: string;
  description: string;
  price: number;
  image?: string;
  stock?: number;
}

interface ProductCardProps {
  product: Product;
  onViewDetails?: (productId: Id<"products">) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const addToCart = useMutation(api.cart.addToCart);

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId: product._id, quantity: 1 });
      toast.success("Added to cart!");
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    }
  };

  return (
    <div className="glass rounded-lg p-4 card-hover overflow-hidden group">
      <div className="relative overflow-hidden rounded-md mb-3">
        <img
          src={
            product.image || "https://via.placeholder.com/300x200?text=Product"
          }
          alt={product.title}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <h3 className="font-semibold text-lg mb-2 text-gray-800">{product.title}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {product.description}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-primary">
          ${product.price.toFixed(2)}
        </span>
        <div className="flex gap-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(product._id)}
              className="px-3 py-2 text-sm glass-dark text-white rounded-lg smooth-transition hover:scale-105 hover:shadow-lg"
            >
              View
            </button>
          )}
          <button
            onClick={handleAddToCart}
            className="px-3 py-2 text-sm bg-gradient-to-r from-primary to-accent text-white rounded-lg smooth-transition hover:scale-105 hover:shadow-lg hover:shadow-primary/50"
          >
            Add to Cart
          </button>
        </div>
      </div>
      {product.stock !== undefined && product.stock < 10 && (
        <p className="text-xs text-red-500 mt-2 animate-pulse-custom">
          Only {product.stock} left in stock!
        </p>
      )}
    </div>
  );
}
