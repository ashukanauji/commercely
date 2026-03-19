import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";
import { useAuth } from "../../context/auth";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [auth] = useAuth();

  // Create category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${process.env.REACT_APP_API}/api/v1/category/create-category`;
      console.log("Creating category at:", url);

      const { data } = await axios.post(
        url,
        { name },
        {
          headers: { Authorization: auth?.token },
        }
      );

      if (data?.success) {
        toast.success(`${name} is created`);
        setName("");
        getAllCategory();
      } else {
        toast.error(data.message || "Failed to create category");
      }
    } catch (error) {
      console.error("handleSubmit error:", {
        message: error.message,
        response: error.response?.data,
      });
      toast.error("Something went wrong in input form");
    }
  };

  // Get all categories
  const getAllCategory = async () => {
    try {
      const url = `${process.env.REACT_APP_API}/api/v1/category/get-category`;
      console.log("Requesting categories from:", url);

      const { data } = await axios.get(url);

      if (data.success) {
        setCategories(data.category);
      } else {
        toast.error(data.message || "Failed to load categories");
      }
    } catch (error) {
      console.error("getAllCategory error:", {
        message: error.message,
        response: error.response?.data,
      });
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const url = `${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`;
      console.log("Updating category at:", url);

      const { data } = await axios.put(
        url,
        { name: updatedName },
        {
          headers: { Authorization: auth?.token },
        }
      );

      if (data.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message || "Failed to update category");
      }
    } catch (error) {
      console.error("handleUpdate error:", {
        message: error.message,
        response: error.response?.data,
      });
      toast.error("Something went wrong while updating");
    }
  };

  // Delete category
  const handleDelete = async (pId) => {
    try {
      const url = `${process.env.REACT_APP_API}/api/v1/category/delete-category/${pId}`;
      console.log("Deleting category at:", url);

      const { data } = await axios.delete(url, {
        headers: { Authorization: auth?.token },
      });

      if (data.success) {
        toast.success("Category deleted successfully");
        getAllCategory();
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("handleDelete error:", {
        message: error.message,
        response: error.response?.data,
      });
      toast.error("Something went wrong while deleting");
    }
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>
                        <button
                          className="btn btn-primary ms-2"
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(c.name);
                            setSelected(c);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => handleDelete(c._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Update Modal */}
            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              open={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
