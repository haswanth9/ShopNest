import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FaSearch } from 'react-icons/fa';
import './Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        keyword: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        sortBy: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await productAPI.getAll();
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleFilter = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.keyword) params.keyword = filters.keyword;
            if (filters.category) params.category = filters.category;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            if (filters.sortBy) params.sortBy = filters.sortBy;

            const res = await productAPI.filter(params);
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="products-page">
            <h1 className="page-title">All Products</h1>

            <div className="filters">
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        name="keyword"
                        placeholder="Search products..."
                        value={filters.keyword}
                        onChange={handleChange}
                    />
                </div>
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={filters.category}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="minPrice"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={handleChange}
                />
                <select name="sortBy" value={filters.sortBy} onChange={handleChange}>
                    <option value="">Sort By</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A-Z</option>
                    <option value="name_desc">Name: Z-A</option>
                </select>
                <button className="btn-primary" onClick={handleFilter}>Apply Filters</button>
            </div>

            {loading ? (
                <div className="loading">Loading products...</div>
            ) : products.length === 0 ? (
                <div className="empty-state">
                    <h3>No products found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            ) : (
                <div className="grid">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;