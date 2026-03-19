import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import api from "../../utils/api";

const initialState = {
  name: "",
  description: "",
  price: "",
  category: "",
  quantity: "",
  shipping: "true",
  featured: "true",
  photo: null,
};

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await api.get("/api/v1/category/get-category");
      setCategories(data.category);
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          payload.append(key, value);
        }
      });

      const { data } = await api.post("/api/v1/product/create-product", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(data.message);
      navigate("/dashboard/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product");
    }
  };

  return (
    <Layout title="Create product | Commercely">
      <section className="container section-block dashboard-layout">
        <AdminMenu />
        <form className="dashboard-content card-panel form-panel" onSubmit={handleSubmit}>
          <h1>Add a new product</h1>
          <select className="input-control" value={formData.category} onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))} required>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          <input className="input-control" placeholder="Product name" value={formData.name} onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))} required />
          <textarea className="input-control" rows="4" placeholder="Description" value={formData.description} onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))} required />
          <div className="auth-grid">
            <input className="input-control" type="number" placeholder="Price" value={formData.price} onChange={(event) => setFormData((prev) => ({ ...prev, price: event.target.value }))} required />
            <input className="input-control" type="number" placeholder="Quantity" value={formData.quantity} onChange={(event) => setFormData((prev) => ({ ...prev, quantity: event.target.value }))} required />
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
          <input className="input-control" type="file" accept="image/*" onChange={(event) => setFormData((prev) => ({ ...prev, photo: event.target.files[0] }))} required />
          <button className="primary-btn" type="submit">Create product</button>
        </form>
      </section>
    </Layout>
  );
};

export default CreateProduct;
