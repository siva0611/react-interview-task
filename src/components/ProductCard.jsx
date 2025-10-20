import React from 'react';
import toast from 'react-hot-toast';
import './ProductCard.css';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

function ProductCard({ product }) {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, wishlistItems } = useWishlist();

  const handleAddToCart = () => {
    if (currentUser) {
      addToCart(product);
    } else {
      toast.error('Please log in to add items to your cart.');
    }
  };

  const handleToggleWishlist = () => {
    if (currentUser) {
      toggleWishlist(product);
    } else {
      toast.error('Please log in to manage your wishlist.');
    }
  };

  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        <button
          onClick={handleToggleWishlist}
          disabled={product.stock === 0}
          className="wishlist-icon-btn"
          aria-label="Toggle Wishlist"
        >
          <svg className={`wishlist-heart ${isWishlisted ? 'wishlisted' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="price-container">
          <span className="sale-price">₹{product.salePrice.toLocaleString('en-IN')}</span>
          <span className="regular-price">₹{product.regularPrice.toLocaleString('en-IN')}</span>
        </div>
        <p className={`stock-indicator ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
        </p>
      </div>
      <div className="product-actions">
        <button onClick={handleAddToCart} disabled={product.stock === 0}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;