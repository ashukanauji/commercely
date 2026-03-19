import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");

  // Get Single Product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      const product = data.product;
      setName(product.name);
      setId(product._id);
      setDescription(product.description);
      setPrice(product.price);
      setQuantity(product.quantity);
      setShipping(product.shipping ? "1" : "0");
      setCategory(product.category._id);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch product details");
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, []);

  // Get All Categories
  const getAllCategory = async () => {
    try {
      const url = `${process.env.REACT_APP_API}/api/v1/category/get-category`;
      const { data } = await axios.get(url);
      if (data?.success) {
        setCategories(data.category);
      } else {
        toast.error(data.message || "Failed to load categories");
      }
    } catch (error) {
      console.error("getAllCategory error:", error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Update Product
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("category", category);
      productData.append("shipping", shipping);
      photo && productData.append("photo", photo);

      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`,
        productData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // Delete Product (with Admin Auth)
  const handleDelete = async () => {
    try {
      let answer = window.prompt(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;
      await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/product/delete-product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Product Deleted Successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Not Authorized or Something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Update Product"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product</h1>
            <div className="m-1 w-75">
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => setCategory(value)}
                value={category}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>

              <div className="mb-3 text-center">
                {photo ? (
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="product_photo"
                    height={"200px"}
                    className="img img-responsive"
                  />
                ) : (
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${id}`}
                    alt="product_photo"
                    height={"200px"}
                    className="img img-responsive"
                  />
                )}
              </div>

              <input
                type="text"
                value={name}
                placeholder="Product Name"
                className="form-control mb-3"
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                value={description}
                placeholder="Product Description"
                className="form-control mb-3"
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="number"
                value={price}
                placeholder="Price"
                className="form-control mb-3"
                onChange={(e) => setPrice(e.target.value)}
              />

              <input
                type="number"
                value={quantity}
                placeholder="Quantity"
                className="form-control mb-3"
                onChange={(e) => setQuantity(e.target.value)}
              />

              <Select
                bordered={false}
                placeholder="Select Shipping"
                size="large"
                className="form-select mb-3"
                onChange={(value) => setShipping(value)}
                value={shipping}
              >
                <Option value="0">No</Option>
                <Option value="1">Yes</Option>
              </Select>

              <button className="btn btn-primary" onClick={handleUpdate}>
                UPDATE PRODUCT
              </button>
              <button className="btn btn-danger ms-2" onClick={handleDelete}>
                DELETE PRODUCT
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
