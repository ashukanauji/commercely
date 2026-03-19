import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  // Get all products
  const getAllProducts = async () => {
    try {
      const url = `${process.env.REACT_APP_API}/api/v1/product/get-product`;
      console.log("Fetching products from:", url);

      const { data } = await axios.get(url);

      console.log("Products API response:", data);

      if (data?.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message || "Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", {
        message: error.message,
        response: error.response ? error.response.data : null,
      });
      toast.error("Something went wrong while fetching products");
    }
  };

  // Lifecycle - fetch on load
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title="Admin - All Products">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products List</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <Link
                key={p._id}
                to={`/dashboard/admin/product/${p.slug}`}
                className="product-link"
              >
                <div className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
