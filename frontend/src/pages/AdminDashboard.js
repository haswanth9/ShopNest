import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import {
    FaUsers, FaBox, FaShoppingBag, FaDollarSign,
    FaStar, FaTag, FaChartLine, FaTrash
} from 'react-icons/fa';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const COLORS = ['#667eea', '#764ba2', '#ff6b6b', '#ffc107', '#00c9a7', '#845ef7'];

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
        fetchUsers();
        fetchOrders();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await adminAPI.getDashboard();
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const fetchUsers = async () => {
        try {
            const res = await adminAPI.getUsers();
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await adminAPI.getAllOrders();
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminAPI.updateUserRole(userId, { role: newRole });
            toast.success('Role updated!');
            fetchUsers();
        } catch (err) {
            toast.error('Failed to update role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await adminAPI.deleteUser(userId);
            toast.success('User deleted!');
            fetchUsers();
        } catch (err) {
            toast.error('Failed to delete user');
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await adminAPI.updateOrderStatus(orderId, { status: newStatus });
            toast.success('Order status updated!');
            fetchOrders();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const getOrderStatusData = () => {
        const statusCount = {};
        orders.forEach(o => {
            const status = o.status || 'PENDING';
            statusCount[status] = (statusCount[status] || 0) + 1;
        });
        return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
    };

    const getUserRoleData = () => {
        const roleCount = {};
        users.forEach(u => {
            roleCount[u.role] = (roleCount[u.role] || 0) + 1;
        });
        return Object.entries(roleCount).map(([name, value]) => ({ name, value }));
    };

    const getRevenueData = () => {
        const monthlyRevenue = {};
        orders.forEach(o => {
            if (o.orderDate) {
                const date = new Date(o.orderDate);
                const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
                monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (o.totalAmount || 0);
            }
        });
        return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
            month,
            revenue: Math.round(revenue * 100) / 100
        }));
    };

    const getOverviewData = () => {
        if (!stats) return [];
        return [
            { name: 'Users', count: stats.totalUsers },
            { name: 'Products', count: stats.totalProducts },
            { name: 'Orders', count: stats.totalOrders },
            { name: 'Payments', count: stats.totalPayments },
            { name: 'Reviews', count: stats.totalReviews },
            { name: 'Coupons', count: stats.totalCoupons },
        ];
    };

    const getTotalRevenue = () => {
        return orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toFixed(2);
    };

    if (loading) return <div className="loading">Loading dashboard...</div>;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p className="admin-subtitle">Manage your store and track performance</p>
            </div>

            <div className="admin-tabs">
                <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                    <FaChartLine /> Analytics
                </button>
                <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                    <FaUsers /> Users
                </button>
                <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                    <FaShoppingBag /> Orders
                </button>
            </div>

            {activeTab === 'dashboard' && stats && (
                <>
                    <div className="stats-grid">
                        <div className="stat-card stat-purple">
                            <div className="stat-icon-wrap"><FaUsers /></div>
                            <div>
                                <h3>{stats.totalUsers}</h3>
                                <p>Total Users</p>
                            </div>
                        </div>
                        <div className="stat-card stat-blue">
                            <div className="stat-icon-wrap"><FaBox /></div>
                            <div>
                                <h3>{stats.totalProducts}</h3>
                                <p>Total Products</p>
                            </div>
                        </div>
                        <div className="stat-card stat-green">
                            <div className="stat-icon-wrap"><FaShoppingBag /></div>
                            <div>
                                <h3>{stats.totalOrders}</h3>
                                <p>Total Orders</p>
                            </div>
                        </div>
                        <div className="stat-card stat-orange">
                            <div className="stat-icon-wrap"><FaDollarSign /></div>
                            <div>
                                <h3>${getTotalRevenue()}</h3>
                                <p>Total Revenue</p>
                            </div>
                        </div>
                        <div className="stat-card stat-pink">
                            <div className="stat-icon-wrap"><FaStar /></div>
                            <div>
                                <h3>{stats.totalReviews}</h3>
                                <p>Total Reviews</p>
                            </div>
                        </div>
                        <div className="stat-card stat-teal">
                            <div className="stat-icon-wrap"><FaTag /></div>
                            <div>
                                <h3>{stats.totalCoupons}</h3>
                                <p>Active Coupons</p>
                            </div>
                        </div>
                    </div>

                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>Platform Overview</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={getOverviewData()}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="#667eea" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-card">
                            <h3>Order Status Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={getOrderStatusData()}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {getOrderStatusData().map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-card">
                            <h3>Revenue Over Time</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={getRevenueData()}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        formatter={(value) => [`$${value}`, 'Revenue']}
                                    />
                                    <Line type="monotone" dataKey="revenue" stroke="#667eea" strokeWidth={3} dot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-card">
                            <h3>User Roles</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={getUserRoleData()}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {getUserRoleData().map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'users' && (
                <div className="admin-table-wrap">
                    <div className="table-header">
                        <h3>All Users ({users.length})</h3>
                    </div>
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>#{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                        className="role-select"
                                    >
                                        <option value="BUYER">BUYER</option>
                                        <option value="SELLER">SELLER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>
                                <td>
                                    <button className="btn-delete" onClick={() => handleDeleteUser(u.id)}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="admin-table-wrap">
                    <div className="table-header">
                        <h3>All Orders ({orders.length})</h3>
                    </div>
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((o) => (
                            <tr key={o.id}>
                                <td>#{o.id}</td>
                                <td>{o.user?.name || 'N/A'}</td>
                                <td className="amount">${o.totalAmount?.toFixed(2)}</td>
                                <td>
                                        <span className={`status-badge status-${(o.status || 'pending').toLowerCase()}`}>
                                            {o.status || 'PENDING'}
                                        </span>
                                </td>
                                <td>{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : 'N/A'}</td>
                                <td>
                                    <select
                                        value={o.status || 'PENDING'}
                                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="PENDING">PENDING</option>
                                        <option value="PAID">PAID</option>
                                        <option value="SHIPPED">SHIPPED</option>
                                        <option value="DELIVERED">DELIVERED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;