import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).send({ success: false, message: "Name is required" });
    }

    const existingCategory = await categoryModel.findOne({
      slug: slugify(name, { lower: true }),
    });

    if (existingCategory) {
      return res.status(409).send({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await categoryModel.create({
      name: name.trim(),
      slug: slugify(name, { lower: true }),
    });

    return res.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name: name.trim(), slug: slugify(name, { lower: true }) },
      { new: true }
    );

    if (!category) {
      return res.status(404).send({ success: false, message: "Category not found" });
    }

    return res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while updating category",
      error: error.message,
    });
  }
};

export const categoryController = async (_req, res) => {
  try {
    const category = await categoryModel.find({}).sort({ name: 1 });
    return res.status(200).send({
      success: true,
      message: "All categories list",
      category,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while getting categories",
      error: error.message,
    });
  }
};

export const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).send({ success: false, message: "Category not found" });
    }

    const products = await productModel
      .find({ category: category._id })
      .select("-photo")
      .populate("category")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Category fetched successfully",
      category,
      products,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while getting category",
      error: error.message,
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const linkedProducts = await productModel.countDocuments({ category: id });

    if (linkedProducts > 0) {
      return res.status(400).send({
        success: false,
        message: "Delete products in this category before removing it",
      });
    }

    await categoryModel.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while deleting category",
      error: error.message,
    });
  }
};
