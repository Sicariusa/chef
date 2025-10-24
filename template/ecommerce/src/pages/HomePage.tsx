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
  const products = useQuery((api as any).products?.listProducts) ?? [];

  const handleViewDetails = (productId: Id<"products">) => {
    setSelectedProductId(productId);
    setCurrentPage("product");
  };

  return (
    <main className="page">
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)',
        padding: '80px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <div className="animate-fade-in">
              <h1 style={{ 
                fontSize: '3.5rem',
                fontWeight: '700',
                background: 'linear-gradient(90deg, #2563eb 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '24px',
                lineHeight: '1.1'
              }}>
                Welcome to Chef Store
              </h1>
              <p style={{ 
                fontSize: '1.25rem',
                color: 'var(--gray-600)',
                marginBottom: '32px',
                lineHeight: '1.6'
              }}>
                Discover amazing products at unbeatable prices with lightning-fast delivery
              </p>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => setCurrentPage("cart")}
                  className="btn btn-primary btn-lg"
                  style={{
                    background: 'linear-gradient(90deg, #2563eb 0%, #8b5cf6 100%)',
                    borderRadius: '50px',
                    padding: '16px 32px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    boxShadow: 'var(--shadow-lg)',
                    transform: 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                >
                  View Cart
                </button>
                <button
                  onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn btn-outline btn-lg"
                  style={{
                    borderRadius: '50px',
                    padding: '16px 32px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: '2px solid var(--gray-300)',
                    color: 'var(--gray-700)',
                    background: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gray-300)';
                    e.currentTarget.style.color = 'var(--gray-700)';
                  }}
                >
                  Browse Products
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '40px',
          width: '80px',
          height: '80px',
          background: 'rgba(59, 130, 246, 0.2)',
          borderRadius: '50%',
          animation: 'float 3s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '160px',
          right: '80px',
          width: '64px',
          height: '64px',
          background: 'rgba(139, 92, 246, 0.2)',
          borderRadius: '50%',
          animation: 'float 3s ease-in-out infinite 1s'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '25%',
          width: '48px',
          height: '48px',
          background: 'rgba(236, 72, 153, 0.2)',
          borderRadius: '50%',
          animation: 'float 3s ease-in-out infinite 2s'
        }}></div>
      </section>

      {/* Products Section */}
      <section id="products-section" style={{ padding: '64px 0', background: 'var(--white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ 
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'var(--gray-800)',
              marginBottom: '16px'
            }}>
              Featured Products
            </h2>
            <p style={{ 
              color: 'var(--gray-600)',
              fontSize: '1.125rem'
            }}>
              Handpicked items just for you
            </p>
          </div>
          
          {products.length === 0 ? (
            <div className="empty-state">
              <div style={{ animation: 'pulse 2s infinite' }}>
                <div style={{
                  width: '96px',
                  height: '96px',
                  background: 'var(--gray-200)',
                  borderRadius: '50%',
                  margin: '0 auto 16px'
                }}></div>
                <p style={{ 
                  color: 'var(--gray-500)',
                  fontSize: '1.125rem'
                }}>
                  No products available yet. Check back soon!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1" style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--spacing-lg)'
            }}>
              {products.map((product: any, index: number) => (
                <div
                  key={product._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                    product={product}
                    onViewDetails={handleViewDetails}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '64px 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="grid grid-cols-1" style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-lg)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                transition: 'background-color 0.3s ease'
              }}>
                <svg style={{ width: '32px', height: '32px', color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--gray-800)',
                marginBottom: '8px'
              }}>Fast Shipping</h3>
              <p style={{ color: 'var(--gray-600)' }}>Get your orders delivered within 24 hours</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                transition: 'background-color 0.3s ease'
              }}>
                <svg style={{ width: '32px', height: '32px', color: 'var(--success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--gray-800)',
                marginBottom: '8px'
              }}>Quality Guarantee</h3>
              <p style={{ color: 'var(--gray-600)' }}>100% satisfaction or your money back</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                transition: 'background-color 0.3s ease'
              }}>
                <svg style={{ width: '32px', height: '32px', color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--gray-800)',
                marginBottom: '8px'
              }}>24/7 Support</h3>
              <p style={{ color: 'var(--gray-600)' }}>Round-the-clock customer service</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
