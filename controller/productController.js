import fs from "fs";
import slugify from "slugify";
import productModel from "../models/productModel.js";

const validateProductFields = ({ name, description, price, category, quantity, photo }) => {
  if (!name) return "Name is required";
  if (!description) return "Description is required";
  if (!price) return "Price is required";
  if (Number(price) < 0) return "Price must be positive";
  if (!category) return "Category is required";
  if (quantity === undefined || quantity === null || quantity === "") {
    return "Quantity is required";
  }
  if (Number(quantity) < 0) return "Quantity must be positive";
  if (photo && photo.size > 1000000) return "Photo should be less than 1MB";
  return null;
};

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping, featured } = req.fields;
    const { photo } = req.files || {};

    const validationError = validateProductFields({
      name,
      description,
      price,
      category,
      quantity,
      photo,
    });

    if (validationError) {
      return res.status(400).send({ success: false, message: validationError });
    }

    const product = new productModel({
      name,
      slug: slugify(name, { lower: true }),
      description,
      price: Number(price),
      category,
      quantity: Number(quantity),
      shipping: shipping === true || shipping === "true" || shipping === "1",
      featured: featured === true || featured === "true" || featured === "1",
    });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    return res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    const filters = {};

    if (category) filters.category = category;
    if (featured === "true") filters.featured = true;
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const products = await productModel
      .find(filters)
      .populate("category")
      .select("-photo")
      .sort({ featured: -1, createdAt: -1 });

    return res.status(200).send({
      success: true,
      countTotal: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error getting products",
      error: error.message,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    if (!product) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }

    const relatedProducts = await productModel
      .find({
        _id: { $ne: product._id },
        category: product.category._id,
      })
      .select("-photo")
      .limit(4)
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error getting single product",
      error: error.message,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product?.photo?.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }

    return res.status(404).send({ success: false, message: "Photo not found" });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error getting photo",
      error: error.message,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }

    return res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping, featured } = req.fields;
    const { photo } = req.files || {};

    const validationError = validateProductFields({
      name,
      description,
      price,
      category,
      quantity,
      photo,
    });

    if (validationError) {
      return res.status(400).send({ success: false, message: validationError });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        name,
        slug: slugify(name, { lower: true }),
        description,
        price: Number(price),
        category,
        quantity: Number(quantity),
        shipping: shipping === true || shipping === "true" || shipping === "1",
        featured: featured === true || featured === "true" || featured === "1",
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
      await product.save();
    }

    return res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};
