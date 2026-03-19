import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { formatCurrency } from "../../utils/format";
import api from "../../utils/api";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await api.get("/api/v1/product/get-product");
      setProducts(data.products);
    };

    fetchProducts();
  }, []);

  return (
    <Layout title="Manage products | Commercely">
      <section className="container section-block dashboard-layout">
        <AdminMenu />
        <div className="dashboard-content">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Catalog management</span>
              <h1>Products</h1>
            </div>
            <Link to="/dashboard/admin/create-product" className="primary-btn">Add product</Link>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <Link key={product._id} to={`/dashboard/admin/product/${product.slug}`} className="product-card admin-card-link">
                <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`} alt={product.name} className="product-image" />
                <div className="product-card-body">
                  <div className="product-card-top">
                    <span className="pill">{product.category?.name}</span>
                    <strong>{formatCurrency(product.price)}</strong>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description.slice(0, 80)}...</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Products;
