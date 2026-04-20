import React, { useState, useEffect } from 'react';
import { cartAPI, orderAPI } from '../services/api';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await cartAPI.get(user.id);
            setCartItems(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleRemove = async (id) => {
        try {
            await cartAPI.remove(id);
            toast.success('Removed from cart');
            fetchCart();
        } catch (err) {
            toast.error('Failed to remove');
        }
    };

    const handlePlaceOrder = async () => {
        try {
            await orderAPI.place(user.id);
            toast.success('Order placed successfully!');
            navigate('/orders');
        } catch (err) {
            toast.error('Failed to place order');
        }
    };

    const total = cartItems.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
    );

    if (loading) return <div className="loading">Loading cart...</div>;

    return (
        <div className="cart-page">
            <h1 className="page-title">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="empty-state">
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                </div>
            ) : (
                <div className="cart-container">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img
                                    src={item.product?.imageUrl || 'https://via.placeholder.com/100'}
                                    alt={item.product?.name}
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
                                />
                                <div className="cart-item-info">
                                    <h3>{item.product?.name}</h3>
                                    <p className="category">{item.product?.category}</p>
                                    <p className="item-price">${item.product?.price?.toFixed(2)}</p>
                                </div>
                                <div className="cart-item-quantity">
                                    <span>Qty: {item.quantity}</span>
                                </div>
                                <div className="cart-item-total">
                                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                                </div>
                                <button className="btn-danger" onClick={() => handleRemove(item.id)}>
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping:</span>
                            <span>FREE</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button className="btn-primary" onClick={handlePlaceOrder}>
                            Place Order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;