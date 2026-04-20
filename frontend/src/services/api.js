import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8081/api',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (data) => API.post('/auth/register', data),
    login: (data) => API.post('/auth/login', data),
};

export const productAPI = {
    getAll: () => API.get('/products'),
    getById: (id) => API.get(`/products/${id}`),
    search: (name) => API.get(`/products/search?name=${name}`),
    filter: (params) => API.get('/products/filter', { params }),
    add: (data) => API.post('/products', data),
    update: (id, data) => API.put(`/products/${id}`, data),
    delete: (id) => API.delete(`/products/${id}`),
};

export const cartAPI = {
    get: (userId) => API.get(`/cart/${userId}`),
    add: (data) => API.post('/cart', data),
    remove: (id) => API.delete(`/cart/${id}`),
};

export const orderAPI = {
    place: (userId) => API.post(`/orders/${userId}`),
    get: (userId) => API.get(`/orders/${userId}`),
};

export const reviewAPI = {
    getByProduct: (productId) => API.get(`/reviews/product/${productId}`),
    add: (data) => API.post('/reviews', data),
    delete: (id) => API.delete(`/reviews/${id}`),
};

export const wishlistAPI = {
    get: (userId) => API.get(`/wishlist/${userId}`),
    add: (data) => API.post('/wishlist', data),
    remove: (userId, productId) => API.delete(`/wishlist/${userId}/${productId}`),
};

export const couponAPI = {
    validate: (code) => API.get(`/coupons/validate/${code}`),
    getAll: () => API.get('/coupons'),
};

export const paymentAPI = {
    make: (data) => API.post('/payments', data),
    getByUser: (userId) => API.get(`/payments/user/${userId}`),
};

export const addressAPI = {
    get: (userId) => API.get(`/addresses/${userId}`),
    add: (data) => API.post('/addresses', data),
    update: (id, data) => API.put(`/addresses/${id}`, data),
    delete: (id) => API.delete(`/addresses/${id}`),
};

export const notificationAPI = {
    get: (userId) => API.get(`/notifications/${userId}`),
    getUnreadCount: (userId) => API.get(`/notifications/unread/${userId}`),
    markAsRead: (id) => API.put(`/notifications/read/${id}`),
    markAllAsRead: (userId) => API.put(`/notifications/read-all/${userId}`),
};

export const categoryAPI = {
    getAll: () => API.get('/categories'),
};

export const adminAPI = {
    getDashboard: () => API.get('/admin/dashboard'),
    getUsers: () => API.get('/admin/users'),
    updateUserRole: (id, data) => API.put(`/admin/users/${id}/role`, data),
    deleteUser: (id) => API.delete(`/admin/users/${id}`),
    getAllOrders: () => API.get('/admin/orders'),
    updateOrderStatus: (id, data) => API.put(`/admin/orders/${id}/status`, data),
};

export const imageAPI = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return API.post('/images/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
};

export default API;