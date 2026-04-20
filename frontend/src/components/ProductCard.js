import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { cartAPI, wishlistAPI } from '../services/api';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            toast.error('Please login first!');
            return;
        }
        try {
            await cartAPI.add({ userId: user.id, productId: product.id, quantity: 1 });
            toast.success('Added to cart!');
        } catch (err) {
            toast.error('Failed to add to cart');
        }
    };

    const handleAddToWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            toast.error('Please login first!');
            return;
        }
        try {
            await wishlistAPI.add({ userId: user.id, productId: product.id });
            toast.success('Added to wishlist!');
        } catch (err) {
            toast.error('Already in wishlist or failed');
        }
    };

    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="product-image">
                <img
                    src={product.imageUrl || 'https://via.placeholder.com/280x200?text=Product'}
                    alt={product.name}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/280x200?text=Product'; }}
                />
                {product.category && (
                    <span className="product-badge">{product.category}</span>
                )}
                <button className="wishlist-btn" onClick={handleAddToWishlist} title="Add to wishlist">
                    <FaHeart />
                </button>
                <div className="product-overlay">
                    <button className="quick-add-btn" onClick={handleAddToCart}>
                        <FaShoppingCart /> Add to Cart
                    </button>
                </div>
            </div>
            <div className="product-info">
                <h3>{product.name}</h3>
                <div className="product-rating">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                    <span>(4.8)</span>
                </div>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    <button className="add-cart-btn" onClick={handleAddToCart} title="Add to cart">
                        <FaShoppingCart />
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;