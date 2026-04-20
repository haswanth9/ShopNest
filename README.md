# 🛍️ ShopNest — Full-Stack E-Commerce Platform

A production-ready, full-stack e-commerce application built with **Spring Boot**, **React**, and **MySQL** featuring JWT authentication, role-based access control, admin analytics dashboard, and a modern responsive UI.

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green?style=flat-square&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql)
![JWT](https://img.shields.io/badge/Auth-JWT-purple?style=flat-square)

---

## ✨ Features

### Customer Features
- **Product Browsing** — Browse products with advanced search, filtering by category/price, and sorting
- **Shopping Cart** — Add, remove items with real-time cart count in navbar
- **Order Management** — Place orders, view order history and status tracking
- **Wishlist** — Save favorite products for later
- **Product Reviews** — Rate and review purchased products
- **User Profiles** — Manage account details and addresses
- **Coupon System** — Apply discount coupons at checkout
- **Notifications** — Real-time notification bell with unread count

### Admin Features
- **Analytics Dashboard** — Interactive charts (bar, pie, line) showing revenue, orders, user roles, and platform overview
- **User Management** — View all users, change roles (Buyer/Seller/Admin), delete accounts
- **Order Management** — View all orders, update order status (Pending → Paid → Shipped → Delivered)
- **Product Management** — Add, edit, delete products with image upload support

### Security
- **JWT Authentication** — Stateless token-based auth with user info encoded in tokens
- **Role-Based Access Control** — ADMIN, SELLER, and BUYER roles with endpoint-level protection
- **Password Hashing** — BCrypt encryption for all passwords
- **Password Protection** — `@JsonIgnore` prevents password hash from appearing in API responses
- **CORS Configuration** — Restricted to frontend origin only
- **JWT Filter** — Custom filter validates tokens on every authenticated request

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 17 | Programming language |
| Spring Boot 3.x | REST API framework |
| Spring Security | Authentication & authorization |
| Spring Data JPA | Database ORM |
| MySQL 8.0 | Relational database |
| JWT (jjwt) | Token-based authentication |
| Lombok | Boilerplate reduction |
| BCrypt | Password hashing |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router DOM | Client-side routing |
| Axios | HTTP client with interceptors |
| Recharts | Analytics charts & data visualization |
| React Icons | Icon library |
| React Toastify | Toast notifications |

---

## 📁 Project Structure

```
ShopNest/
├── backend/
│   └── src/main/java/com/shopnest/backend/
│       ├── controller/        # REST API endpoints (13 controllers)
│       │   ├── AuthController.java
│       │   ├── ProductController.java
│       │   ├── CartController.java
│       │   ├── OrderController.java
│       │   ├── AdminController.java
│       │   ├── ReviewController.java
│       │   ├── WishlistController.java
│       │   ├── PaymentController.java
│       │   ├── CouponController.java
│       │   ├── AddressController.java
│       │   ├── ShippingController.java
│       │   ├── NotificationController.java
│       │   ├── CategoryController.java
│       │   └── ImageController.java
│       ├── model/             # JPA entities
│       ├── repository/        # Spring Data repositories
│       ├── service/           # Business logic
│       └── security/          # JWT + Spring Security config
│           ├── JwtUtil.java
│           ├── JwtAuthFilter.java
│           ├── SecurityConfig.java
│           └── WebConfig.java
│
├── frontend/
│   └── src/
│       ├── components/        # Reusable UI components
│       │   ├── Navbar.js      # Sticky navbar with cart badge & user dropdown
│       │   └── ProductCard.js # Product card with hover effects
│       ├── pages/             # Route-level pages
│       │   ├── Home.js        # Landing page with hero, categories, featured products
│       │   ├── Products.js    # Product listing with filters & search
│       │   ├── ProductDetail.js
│       │   ├── Cart.js
│       │   ├── Orders.js
│       │   ├── Wishlist.js
│       │   ├── Profile.js
│       │   ├── Login.js
│       │   ├── Register.js
│       │   └── AdminDashboard.js  # Analytics with Recharts
│       └── services/
│           └── api.js         # Axios instance with JWT interceptor
└── README.md
```

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────────────┐
│                 │  HTTP   │      Spring Boot API      │
│   React SPA     │ ◄─────► │                          │
│   (Port 3000)   │  REST   │  ┌────────────────────┐  │
│                 │  + JWT  │  │  Security Layer     │  │
│  ┌───────────┐  │         │  │  - JWT Filter       │  │
│  │  Axios +  │  │         │  │  - Role-based Auth  │  │
│  │  JWT      │  │         │  │  - BCrypt           │  │
│  │  Interceptor│ │         │  └────────────────────┘  │
│  └───────────┘  │         │  ┌────────────────────┐  │
│                 │         │  │  Controllers (13)   │  │
│  ┌───────────┐  │         │  │  - Auth, Products   │  │
│  │  Recharts │  │         │  │  - Cart, Orders     │  │
│  │  Charts   │  │         │  │  - Admin, Reviews   │  │
│  └───────────┘  │         │  │  - Payments, etc.   │  │
│                 │         │  └────────────────────┘  │
└─────────────────┘         │  ┌────────────────────┐  │
                            │  │  Spring Data JPA    │  │
                            │  └─────────┬──────────┘  │
                            │            │             │
                            └────────────┼─────────────┘
                                         │
                            ┌────────────▼─────────────┐
                            │       MySQL 8.0          │
                            │    (shopnest_db)         │
                            │                          │
                            │  Tables: users, products,│
                            │  orders, cart_items,     │
                            │  reviews, payments,      │
                            │  wishlists, categories,  │
                            │  notifications, etc.     │
                            └──────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 16+
- MySQL 8.0+
- Maven

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ShopNest.git
cd ShopNest/backend

# 2. Create the MySQL database
mysql -u root -p -e "CREATE DATABASE shopnest_db;"

# 3. Update database credentials in application.properties
# src/main/resources/application.properties
# spring.datasource.username=root
# spring.datasource.password=YOUR_PASSWORD

# 4. Run the backend
./mvnw spring-boot:run
# Server starts at http://localhost:8081
```

### Frontend Setup

```bash
# 1. Navigate to frontend
cd ShopNest/frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
# App opens at http://localhost:3000
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login & get JWT token | Public |

### Products
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/{id}` | Get product by ID | Public |
| GET | `/api/products/filter` | Filter products | Public |
| GET | `/api/products/search?name=` | Search products | Public |
| POST | `/api/products` | Add new product | Authenticated |
| PUT | `/api/products/{id}` | Update product | Authenticated |
| DELETE | `/api/products/{id}` | Delete product | Authenticated |

### Cart
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/cart/{userId}` | Get user's cart | Authenticated |
| POST | `/api/cart` | Add item to cart | Authenticated |
| DELETE | `/api/cart/{id}` | Remove from cart | Authenticated |

### Orders
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/orders/{userId}` | Place order | Authenticated |
| GET | `/api/orders/{userId}` | Get user's orders | Authenticated |

### Admin
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/dashboard` | Dashboard stats | ADMIN only |
| GET | `/api/admin/users` | All users | ADMIN only |
| PUT | `/api/admin/users/{id}/role` | Update user role | ADMIN only |
| GET | `/api/admin/orders` | All orders | ADMIN only |
| PUT | `/api/admin/orders/{id}/status` | Update order status | ADMIN only |

*Plus endpoints for: Reviews, Wishlist, Payments, Addresses, Shipping, Notifications, Categories, Coupons, Image Upload*

---

## 🔐 Security Implementation

**JWT Flow:**
1. User logs in with email/password
2. Backend validates credentials and returns a JWT containing `userId`, `name`, `email`, and `role`
3. Frontend stores the token and decodes user info from it (no separate user endpoint needed)
4. Every subsequent request includes the token via Axios interceptor
5. `JwtAuthFilter` validates the token and sets Spring Security context
6. Endpoints enforce role-based access (`ADMIN`, `SELLER`, `BUYER`)

**Key Security Features:**
- Passwords never appear in API responses (`@JsonIgnore`)
- JWT tokens expire after 24 hours
- CORS restricted to `http://localhost:3000`
- Admin endpoints require `ROLE_ADMIN`
- Authenticated endpoints reject requests without valid tokens

---

## 📊 Admin Dashboard

The admin dashboard features interactive analytics built with **Recharts**:

- **Platform Overview** — Bar chart showing users, products, orders, payments, reviews, and coupons
- **Order Status Distribution** — Donut chart showing orders by status (Pending, Paid, Shipped, Delivered)
- **Revenue Over Time** — Line chart tracking monthly revenue
- **User Roles** — Donut chart showing distribution of Buyers, Sellers, and Admins
- **User Management** — Table with role editing and user deletion
- **Order Management** — Table with status updates via dropdown

---

## 🎨 UI Highlights

- **Modern Homepage** — Hero section with gradient CTA, animated stats counter, feature bar, category grid, featured products, promo banner, newsletter signup, and footer
- **Sticky Navbar** — Glass-morphism effect on scroll, cart badge with item count, notification bell with unread count, user avatar dropdown with profile/logout
- **Product Cards** — Category badge, hover zoom effect, slide-up "Add to Cart" overlay, wishlist heart button, star ratings
- **Responsive Design** — Mobile hamburger menu, adaptive grid layouts, touch-friendly interactions
- **Consistent Design System** — Purple/indigo gradient theme, rounded corners, smooth transitions, card-based layouts

---

## 🤝 What I Learned

- Implementing **stateless JWT authentication** with Spring Security and custom filters
- Building a **role-based access control** system (ADMIN/SELLER/BUYER)
- Creating **interactive data visualizations** with Recharts
- Designing a **responsive UI** with CSS Grid, Flexbox, and media queries
- Handling **file uploads** with Spring Boot multipart support
- Managing **complex state** across components with React hooks and localStorage
- Structuring a **full-stack application** with clean separation of concerns

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by **Haswanth Avirneni**
