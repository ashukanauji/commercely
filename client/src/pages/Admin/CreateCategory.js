import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "antd";
import CategoryForm from "../../components/Form/CategoryForm";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import api from "../../utils/api";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [visible, setVisible] = useState(false);

  const getAllCategory = async () => {
    const { data } = await api.get("/api/v1/category/get-category");
    setCategories(data.category);
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post("/api/v1/category/create-category", { name });
      toast.success(data.message);
      setName("");
      getAllCategory();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.put(`/api/v1/category/update-category/${selected._id}`, {
        name: updatedName,
      });
      toast.success(data.message);
      setVisible(false);
      setSelected(null);
      setUpdatedName("");
      getAllCategory();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await api.delete(`/api/v1/category/delete-category/${id}`);
      toast.success(data.message);
      getAllCategory();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <Layout title="Manage categories | Commercely">
      <section className="container section-block dashboard-layout">
        <AdminMenu />
        <div className="dashboard-content">
          <div className="card-panel">
            <h1>Manage categories</h1>
            <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
          </div>
          <div className="card-panel top-gap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td className="table-actions">
                      <button className="secondary-btn" onClick={() => { setSelected(category); setUpdatedName(category.name); setVisible(true); }}>
                        Edit
                      </button>
                      <button className="danger-btn" onClick={() => handleDelete(category._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Modal open={visible} onCancel={() => setVisible(false)} footer={null}>
            <CategoryForm
              handleSubmit={handleUpdate}
              value={updatedName}
              setValue={setUpdatedName}
              buttonText="Update category"
            />
          </Modal>
        </div>
      </section>
    </Layout>
  );
};

export default CreateCategory;
