import React, { useState, useEffect } from 'react';
import { wishlistAPI, cartAPI } from '../services/api';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Wishlist.css';

const Wishlist = () => {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const res = await wishlistAPI.get(user.id);
            setWishlist(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleRemove = async (productId) => {
        try {
            await wishlistAPI.remove(user.id, productId);
            toast.success('Removed from wishlist');
            fetchWishlist();
        } catch (err) {
            toast.error('Failed to remove');
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            await cartAPI.add({ userId: user.id, productId, quantity: 1 });
            toast.success('Added to cart!');
        } catch (err) {
            toast.error('Failed to add');
        }
    };

    if (loading) return <div className="loading">Loading wishlist...</div>;

    return (
        <div className="wishlist-page">
            <h1 className="page-title">My Wishlist</h1>

            {wishlist.length === 0 ? (
                <div className="empty-state">
                    <h3>Your wishlist is empty</h3>
                    <p>Save products you love for later!</p>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlist.map((item) => (
                        <div key={item.id} className="wishlist-item">
                            <img
                                src={item.product?.imageUrl || 'https://via.placeholder.com/200'}
                                alt={item.product?.name}
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/200'; }}
                            />
                            <div className="wishlist-info">
                                <h3>{item.product?.name}</h3>
                                <p className="price">${item.product?.price?.toFixed(2)}</p>
                                <div className="wishlist-actions">
                                    <button className="btn-primary" onClick={() => handleAddToCart(item.product.id)}>
                                        <FaShoppingCart /> Add to Cart
                                    </button>
                                    <button className="btn-danger" onClick={() => handleRemove(item.product.id)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;