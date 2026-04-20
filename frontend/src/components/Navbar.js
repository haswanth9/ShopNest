import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    FaShoppingCart, FaHeart, FaUser, FaSignOutAlt,
    FaBell, FaBars, FaTimes, FaChevronDown
} from 'react-icons/fa';
import { notificationAPI, cartAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchUnreadCount(parsedUser.id);
            fetchCartCount(parsedUser.id);
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMenuOpen(false);
        setDropdownOpen(false);
    }, [location]);

    const fetchUnreadCount = async (userId) => {
        try {
            const res = await notificationAPI.getUnreadCount(userId);
            setUnreadCount(res.data.unreadCount || res.data || 0);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCartCount = async (userId) => {
        try {
            const res = await cartAPI.get(userId);
            setCartCount(Array.isArray(res.data) ? res.data.length : 0);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setCartCount(0);
        setUnreadCount(0);
        toast.success('Logged out successfully!');
        navigate('/login');
    };

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    🛍️ ShopNest
                </Link>

                {/* Mobile hamburger button */}
                <button
                    className="navbar-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Overlay for mobile */}
                {menuOpen && (
                    <div className="navbar-overlay" onClick={() => setMenuOpen(false)} />
                )}

                <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
                    <Link to="/products" className={location.pathname === '/products' ? 'active-link' : ''}>
                        Products
                    </Link>

                    {user ? (
                        <>
                            <Link to="/wishlist" className="icon-link" title="Wishlist">
                                <FaHeart />
                                <span className="link-label">Wishlist</span>
                            </Link>
                            <Link to="/cart" className="icon-link" title="Cart">
                                <FaShoppingCart />
                                {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
                                <span className="link-label">Cart</span>
                            </Link>
                            <Link to="/orders" className={location.pathname === '/orders' ? 'active-link' : ''}>
                                Orders
                            </Link>

                            <div className="icon-link notification-bell" title="Notifications">
                                <FaBell />
                                {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
                                <span className="link-label">Notifications</span>
                            </div>

                            {user.role === 'ADMIN' && (
                                <Link to="/admin" className={location.pathname === '/admin' ? 'active-link' : ''}>
                                    Admin
                                </Link>
                            )}

                            {/* User dropdown */}
                            <div className="user-dropdown">
                                <button
                                    className="user-dropdown-btn"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <div className="user-avatar">
                                        {user.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
                                    </div>
                                    <span className="user-name">{user.name || 'Account'}</span>
                                    <FaChevronDown className={`dropdown-arrow ${dropdownOpen ? 'rotated' : ''}`} />
                                </button>
                                {dropdownOpen && (
                                    <div className="dropdown-menu">
                                        <Link to="/profile" className="dropdown-item">
                                            <FaUser /> Profile
                                        </Link>
                                        <button onClick={handleLogout} className="dropdown-item logout-item">
                                            <FaSignOutAlt /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={location.pathname === '/login' ? 'active-link' : ''}>
                                Login
                            </Link>
                            <Link to="/register" className="register-btn">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;