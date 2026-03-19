import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import api from "../../utils/api";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [categories, setCategories] = useState([]);
  const [id, setId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    shipping: "true",
    featured: "false",
    photo: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [categoryRes, productRes] = await Promise.all([
        api.get("/api/v1/category/get-category"),
        api.get(`/api/v1/product/get-product/${slug}`),
      ]);

      const product = productRes.data.product;
      setCategories(categoryRes.data.category);
      setId(product._id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category?._id,
        quantity: product.quantity,
        shipping: String(product.shipping),
        featured: String(product.featured),
        photo: null,
      });
    };

    fetchData();
  }, [slug]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          payload.append(key, value);
        }
      });

      const { data } = await api.put(`/api/v1/product/update-product/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(data.message);
      navigate("/dashboard/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  const handleDelete = async () => {
    try {
      const { data } = await api.delete(`/api/v1/product/delete-product/${id}`);
      toast.success(data.message);
      navigate("/dashboard/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <Layout title="Update product | Commercely">
      <section className="container section-block dashboard-layout">
        <AdminMenu />
        <form className="dashboard-content card-panel form-panel" onSubmit={handleUpdate}>
          <h1>Update product</h1>
          <select className="input-control" value={formData.category} onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))} required>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          <input className="input-control" value={formData.name} onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))} required />
          <textarea className="input-control" rows="4" value={formData.description} onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))} required />
          <div className="auth-grid">
            <input className="input-control" type="number" value={formData.price} onChange={(event) => setFormData((prev) => ({ ...prev, price: event.target.value }))} required />
            <input className="input-control" type="number" value={formData.quantity} onChange={(event) => setFormData((prev) => ({ ...prev, quantity: event.target.value }))} required />
          </div>
          <div className="auth-grid">
            <select className="input-control" value={formData.shipping} onChange={(event) => setFormData((prev) => ({ ...prev, shipping: event.target.value }))}>
              <option value="true">Shipping available</option>
              <option value="false">No shipping</option>
            </select>
            <select className="input-control" value={formData.featured} onChange={(event) => setFormData((prev) => ({ ...prev, featured: event.target.value }))}>
              <option value="true">Featured product</option>
              <option value="false">Regular product</option>
            </select>
          </div>
          <img src={formData.photo ? URL.createObjectURL(formData.photo) : `${process.env.REACT_APP_API}/api/v1/product/product-photo/${id}`} alt={formData.name} className="details-image preview-image" />
          <input className="input-control" type="file" accept="image/*" onChange={(event) => setFormData((prev) => ({ ...prev, photo: event.target.files[0] }))} />
          <div className="table-actions">
            <button className="primary-btn" type="submit">Save updates</button>
            <button className="danger-btn" type="button" onClick={handleDelete}>Delete product</button>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default UpdateProduct;
