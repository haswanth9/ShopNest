import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productAPI, cartAPI, wishlistAPI, reviewAPI } from '../services/api';
import { FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await productAPI.getById(id);
            setProduct(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const fetchReviews = async () => {
        try {
            const res = await reviewAPI.getByProduct(id);
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            toast.error('Please login first!');
            return;
        }
        try {
            await cartAPI.add({ userId: user.id, productId: product.id, quantity });
            toast.success('Added to cart!');
        } catch (err) {
            toast.error('Failed to add to cart');
        }
    };

    const handleAddToWishlist = async () => {
        if (!user) {
            toast.error('Please login first!');
            return;
        }
        try {
            await wishlistAPI.add({ userId: user.id, productId: product.id });
            toast.success('Added to wishlist!');
        } catch (err) {
            toast.error('Already in wishlist');
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login first!');
            return;
        }
        try {
            await reviewAPI.add({
                userId: user.id,
                productId: product.id,
                rating: newReview.rating,
                comment: newReview.comment
            });
            toast.success('Review added!');
            setNewReview({ rating: 5, comment: '' });
            fetchReviews();
        } catch (err) {
            toast.error('Failed to add review');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!product) return <div className="empty-state"><h3>Product not found</h3></div>;

    return (
        <div className="product-detail">
            <div className="product-detail-top">
                <div className="product-detail-image">
                    <img
                        src={product.imageUrl || 'https://via.placeholder.com/500x500?text=Product'}
                        alt={product.name}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/500x500?text=Product'; }}
                    />
                </div>
                <div className="product-detail-info">
                    <p className="category-tag">{product.category}</p>
                    <h1>{product.name}</h1>
                    <p className="description">{product.description}</p>
                    <div className="price-section">
                        <span className="price">${product.price.toFixed(2)}</span>
                        <span className="stock">Stock: {product.quantity}</span>
                    </div>
                    <div className="quantity-section">
                        <label>Quantity:</label>
                        <div className="quantity-controls">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                    </div>
                    <div className="action-buttons">
                        <button className="btn-primary" onClick={handleAddToCart}>
                            <FaShoppingCart /> Add to Cart
                        </button>
                        <button className="btn-secondary" onClick={handleAddToWishlist}>
                            <FaHeart /> Wishlist
                        </button>
                    </div>
                </div>
            </div>

            <div className="reviews-section">
                <h2>Customer Reviews ({reviews.length})</h2>

                {user && (
                    <form className="review-form" onSubmit={handleSubmitReview}>
                        <h3>Write a Review</h3>
                        <div className="form-group">
                            <label>Rating:</label>
                            <select
                                value={newReview.rating}
                                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                            >
                                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                                <option value="4">⭐⭐⭐⭐ (4)</option>
                                <option value="3">⭐⭐⭐ (3)</option>
                                <option value="2">⭐⭐ (2)</option>
                                <option value="1">⭐ (1)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Comment:</label>
                            <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                placeholder="Share your thoughts..."
                                rows="3"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary">Submit Review</button>
                    </form>
                )}

                {reviews.length === 0 ? (
                    <p>No reviews yet. Be the first!</p>
                ) : (
                    <div className="reviews-list">
                        {reviews.map((review) => (
                            <div key={review.id} className="review-item">
                                <div className="review-header">
                                    <strong>{review.user?.name || 'Anonymous'}</strong>
                                    <span>{'⭐'.repeat(review.rating)}</span>
                                </div>
                                <p>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;