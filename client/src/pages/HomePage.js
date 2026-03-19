import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import ProductCard from "../components/shop/ProductCard";
import api from "../utils/api";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/api/v1/product/get-product"),
          api.get("/api/v1/category/get-category"),
        ]);

        setProducts(productsRes.data.products);
        setCategories(categoriesRes.data.category);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  const fallbackProducts = useMemo(() => products.slice(0, 4), [products]);

  return (
    <Layout title="Commercely | Discover your next favorite find">
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Production-ready ecommerce starter</span>
            <h1>Modern shopping for fashion, tech, and home essentials.</h1>
            <p>
              Browse curated collections, add products to your cart, complete a
              mock checkout, and manage orders from a polished customer and
              admin dashboard.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="primary-btn">
                Explore products
              </Link>
              <Link to="/register" className="secondary-btn">
                Create account
              </Link>
            </div>
          </div>
          <div className="hero-card-grid">
            {categories.slice(0, 4).map((category) => (
              <div key={category._id} className="mini-card">
                <strong>{category.name}</strong>
                <span>Fresh arrivals and bestsellers</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Featured products</span>
            <h2>Top picks for today</h2>
          </div>
          <Link to="/products" className="secondary-btn">
            View full catalog
          </Link>
        </div>

        {loading ? (
          <div className="center-state">Loading products...</div>
        ) : (
          <div className="product-grid">
            {(products.length ? products : fallbackProducts).slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default HomePage;
