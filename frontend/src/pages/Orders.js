import React, { useState, useEffect } from 'react';
import { orderAPI, paymentAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user) fetchOrders();
        else setLoading(false);
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await orderAPI.get(user.id);
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handlePayment = async (orderId) => {
        try {
            await paymentAPI.make({ orderId, userId: user.id, paymentMethod: 'CREDIT_CARD' });
            toast.success('Payment successful!');
            fetchOrders();
        } catch (err) {
            toast.error('Payment failed');
        }
    };

    if (loading) return <div className="loading">Loading orders...</div>;

    return (
        <div className="orders-page">
            <h1 className="page-title">My Orders</h1>

            {orders.length === 0 ? (
                <div className="empty-state">
                    <h3>No orders yet</h3>
                    <p>Start shopping to see your orders here!</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <h3>Order #{order.id}</h3>
                                    <p className="order-date">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`badge badge-${order.status === 'PAID' ? 'success' : 'warning'}`}>
                  {order.status}
                </span>
                            </div>
                            <div className="order-items">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="order-item">
                                        <span>{item.product?.name} × {item.quantity}</span>
                                        <span>${item.price.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-footer">
                                <div className="order-total">
                                    Total: <strong>${order.totalAmount.toFixed(2)}</strong>
                                </div>
                                {order.status === 'PLACED' && (
                                    <button className="btn-primary" onClick={() => handlePayment(order.id)}>
                                        Pay Now
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;