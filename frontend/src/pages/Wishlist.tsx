import React, { useEffect, useState } from 'react';
import type { ManagedPropertySummary } from '../types/managedProperties';
import { wishlistService } from '../axios/wishlistService';
import PropertyCard from '../components/PropertyCard';
import { authService } from '../auth/authService';
import '../assets/css/Wishlist.css';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';

const Wishlist: React.FC = () => {
  const [properties, setProperties] = useState<ManagedPropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      const session = authService.getSession();
      if (!session?.email) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await wishlistService.getWishlist(session.email);
        setProperties(data);
      } catch (err: any) {
        setError('Nu s-au putut încărca proprietățile salvate.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = (id: number) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      <Header />
      <div className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-header">
            <div className="wishlist-header-icon">❤️</div>
            <h1 className="wishlist-title">Favoritele Mele</h1>
          </div>
          
          {loading ? (
            <div className="wishlist-loading">
              <div className="wishlist-spinner"></div>
              <p>Încărcăm proprietățile salvate...</p>
            </div>
          ) : (
            <>
              {error && <div className="wishlist-error">{error}</div>}

              {!error && properties.length === 0 ? (
                <div className="wishlist-empty">
                  <div className="wishlist-empty-icon">🤍</div>
                  <h2>Nu ai salvat nicio proprietate încă.</h2>
                  <p>Apasă pe inimioara de pe proprietăți pentru a le salva aici și a le găsi mai ușor. 
                     Astfel, vei putea compara cele mai atractive opțiuni de cazare înainte de a rezerva.</p>
                </div>
              ) : (
                <div className="wishlist-grid">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} onRemove={handleRemove} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;

