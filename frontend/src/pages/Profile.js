import React, { useState, useEffect } from 'react';
import { addressAPI, notificationAPI } from '../services/api';
import { FaUser, FaMapMarkerAlt, FaBell, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const [addresses, setAddresses] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [newAddress, setNewAddress] = useState({
        fullName: '', phone: '', streetAddress: '',
        city: '', state: '', zipCode: '', country: ''
    });
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchAddresses();
        fetchNotifications();
    }, []);

    const fetchAddresses = async () => {
        try {
            const res = await addressAPI.get(user.id);
            setAddresses(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await notificationAPI.get(user.id);
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            await addressAPI.add({ ...newAddress, userId: user.id });
            toast.success('Address added!');
            setNewAddress({ fullName: '', phone: '', streetAddress: '', city: '', state: '', zipCode: '', country: '' });
            fetchAddresses();
        } catch (err) {
            toast.error('Failed to add address');
        }
    };

    const handleDeleteAddress = async (id) => {
        try {
            await addressAPI.delete(id);
            toast.success('Address deleted');
            fetchAddresses();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead(user.id);
            toast.success('All marked as read');
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="profile-page">
            <h1 className="page-title">My Profile</h1>

            <div className="profile-tabs">
                <button
                    className={activeTab === 'info' ? 'active' : ''}
                    onClick={() => setActiveTab('info')}
                >
                    <FaUser /> Info
                </button>
                <button
                    className={activeTab === 'addresses' ? 'active' : ''}
                    onClick={() => setActiveTab('addresses')}
                >
                    <FaMapMarkerAlt /> Addresses
                </button>
                <button
                    className={activeTab === 'notifications' ? 'active' : ''}
                    onClick={() => setActiveTab('notifications')}
                >
                    <FaBell /> Notifications
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'info' && (
                    <div className="info-section">
                        <h3>Account Information</h3>
                        <div className="info-row"><strong>Name:</strong> {user?.name || 'N/A'}</div>
                        <div className="info-row"><strong>Email:</strong> {user?.email}</div>
                        <div className="info-row"><strong>Role:</strong> {user?.role}</div>
                    </div>
                )}

                {activeTab === 'addresses' && (
                    <div className="addresses-section">
                        <h3>Add New Address</h3>
                        <form className="address-form" onSubmit={handleAddAddress}>
                            <input placeholder="Full Name" value={newAddress.fullName}
                                   onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})} required />
                            <input placeholder="Phone" value={newAddress.phone}
                                   onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} required />
                            <input placeholder="Street Address" value={newAddress.streetAddress}
                                   onChange={(e) => setNewAddress({...newAddress, streetAddress: e.target.value})} required />
                            <input placeholder="City" value={newAddress.city}
                                   onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} required />
                            <input placeholder="State" value={newAddress.state}
                                   onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} required />
                            <input placeholder="Zip Code" value={newAddress.zipCode}
                                   onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})} required />
                            <input placeholder="Country" value={newAddress.country}
                                   onChange={(e) => setNewAddress({...newAddress, country: e.target.value})} required />
                            <button type="submit" className="btn-primary">Add Address</button>
                        </form>

                        <h3 className="saved-addresses-title">Saved Addresses</h3>
                        {addresses.length === 0 ? (
                            <p>No addresses saved</p>
                        ) : (
                            addresses.map((addr) => (
                                <div key={addr.id} className="address-card">
                                    <div>
                                        <strong>{addr.fullName}</strong>
                                        <p>{addr.streetAddress}, {addr.city}, {addr.state} {addr.zipCode}</p>
                                        <p>{addr.country} • {addr.phone}</p>
                                    </div>
                                    <button className="btn-danger" onClick={() => handleDeleteAddress(addr.id)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="notifications-section">
                        <div className="section-header">
                            <h3>Notifications</h3>
                            {notifications.length > 0 && (
                                <button className="btn-secondary" onClick={handleMarkAllAsRead}>
                                    Mark all as read
                                </button>
                            )}
                        </div>
                        {notifications.length === 0 ? (
                            <p>No notifications</p>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`notification-item ${!notif.read ? 'unread' : ''}`}
                                    onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                                >
                                    <h4>{notif.title}</h4>
                                    <p>{notif.message}</p>
                                    <span className="notif-date">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;