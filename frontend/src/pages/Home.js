import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import {
    FaArrowRight, FaTruck, FaShieldAlt, FaUndo, FaHeadset,
    FaStar, FaFire, FaTag
} from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const productsRes = await productAPI.getAll();
            setFeaturedProducts(productsRes.data.slice(0, 8));

            try {
                const catRes = await categoryAPI.getAll();
                setCategories(catRes.data.slice(0, 6));
            } catch (err) {
                // categories optional
            }
        } catch (err) {
            console.error('Failed to load home data', err);
        }
        setLoading(false);
    };

    const handleNewsletter = (e) => {
        e.preventDefault();
        if (email) {
            alert(`Thanks for subscribing, ${email}!`);
            setEmail('');
        }
    };

    return (
        <div className="home-page">
            {/* HERO SECTION */}
            <section className="hero">
                <div className="hero-content">
                    <span className="hero-badge">
                        <FaFire /> New Collection 2026
                    </span>
                    <h1>
                        Discover Amazing Products<br />
                        at <span className="gradient-text">Unbeatable Prices</span>
                    </h1>
                    <p>
                        Shop the latest trends in fashion, electronics, and more.
                        Free shipping on orders over $50.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/products" className="btn-hero-primary">
                            Shop Now <FaArrowRight />
                        </Link>
                        <Link to="/products" className="btn-hero-secondary">
                            Browse Categories
                        </Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat">
                            <h3>10K+</h3>
                            <p>Happy Customers</p>
                        </div>
                        <div className="stat">
                            <h3>500+</h3>
                            <p>Products</p>
                        </div>
                        <div className="stat">
                            <h3>4.9<FaStar /></h3>
                            <p>Average Rating</p>
                        </div>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="hero-circle"></div>
                    <img
                        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600"
                        alt="Shopping"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
            </section>

            {/* FEATURES BAR */}
            <section className="features-bar">
                <div className="feature">
                    <FaTruck className="feature-icon" />
                    <div>
                        <h4>Free Shipping</h4>
                        <p>On orders over $50</p>
                    </div>
                </div>
                <div className="feature">
                    <FaUndo className="feature-icon" />
                    <div>
                        <h4>Easy Returns</h4>
                        <p>30-day return policy</p>
                    </div>
                </div>
                <div className="feature">
                    <FaShieldAlt className="feature-icon" />
                    <div>
                        <h4>Secure Payment</h4>
                        <p>100% secure checkout</p>
                    </div>
                </div>
                <div className="feature">
                    <FaHeadset className="feature-icon" />
                    <div>
                        <h4>24/7 Support</h4>
                        <p>We're here to help</p>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            {categories.length > 0 && (
                <section className="categories-section">
                    <div className="section-header">
                        <h2>Shop by Category</h2>
                        <p>Find exactly what you're looking for</p>
                    </div>
                    <div className="categories-grid">
                        {categories.map((cat, idx) => (
                            <Link
                                to={`/products`}
                                key={cat.id || idx}
                                className="category-card"
                            >
                                <div className="category-icon">
                                    <FaTag />
                                </div>
                                <h3>{cat.name}</h3>
                                <span>Shop now <FaArrowRight /></span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* FEATURED PRODUCTS */}
            <section className="featured-section">
                <div className="section-header">
                    <h2>Featured Products</h2>
                    <p>Handpicked favorites just for you</p>
                </div>

                {loading ? (
                    <div className="loading">Loading featured products...</div>
                ) : featuredProducts.length === 0 ? (
                    <div className="empty-state">
                        <p>No products available yet.</p>
                    </div>
                ) : (
                    <div className="grid">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                <div className="view-all-wrap">
                    <Link to="/products" className="btn-view-all">
                        View All Products <FaArrowRight />
                    </Link>
                </div>
            </section>

            {/* PROMO BANNER */}
            <section className="promo-banner">
                <div className="promo-content">
                    <h2>Summer Sale is Live!</h2>
                    <p>Get up to 50% off on selected items. Limited time offer.</p>
                    <Link to="/products" className="btn-hero-primary">
                        Shop the Sale <FaArrowRight />
                    </Link>
                </div>
            </section>

            {/* NEWSLETTER */}
            <section className="newsletter-section">
                <div className="newsletter-box">
                    <h2>Stay in the Loop</h2>
                    <p>Subscribe to get special offers, free giveaways, and new product alerts.</p>
                    <form onSubmit={handleNewsletter} className="newsletter-form">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="home-footer">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h3 className="footer-logo">ShopNest</h3>
                        <p>Your one-stop destination for quality products at amazing prices.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Shop</h4>
                        <Link to="/products">All Products</Link>
                        <Link to="/products">New Arrivals</Link>
                        <Link to="/products">Best Sellers</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Account</h4>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                        <Link to="/orders">My Orders</Link>
                        <Link to="/wishlist">Wishlist</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Support</h4>
                        <a href="#contact">Contact Us</a>
                        <a href="#faq">FAQs</a>
                        <a href="#shipping">Shipping Info</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 ShopNest. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;