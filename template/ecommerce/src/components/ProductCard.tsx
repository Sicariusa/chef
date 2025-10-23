import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import type { Id } from "../../convex/_generated/dataModel";

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
    <div className="product-card">
      <img
        src={
          product.image || "https://via.placeholder.com/300x200?text=Product"
        }
        alt={product.title}
        className="product-image"
      />
      <div className="product-content">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <div className="flex gap-sm">
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(product._id)}
                className="btn btn-outline btn-sm"
              >
                View
              </button>
            )}
            <button onClick={handleAddToCart} className="btn btn-primary btn-sm">
              Add to Cart
            </button>
          </div>
        </div>
        {product.stock !== undefined && product.stock < 10 && (
          <p className="text-sm text-error" style={{ marginTop: "8px" }}>
            Only {product.stock} left in stock!
          </p>
        )}
      </div>
    </div>
  );
}
