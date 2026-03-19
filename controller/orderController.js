import crypto from "crypto";
import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 200 ? 0 : 15;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + shippingFee + tax).toFixed(2));

  return { subtotal, shippingFee, tax, total };
};

export const createOrderController = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, paymentMethod = "mock", shippingAddress, contactPhone } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      await session.abortTransaction();
      return res.status(400).send({
        success: false,
        message: "Cart items are required",
      });
    }

    if (!shippingAddress || !contactPhone) {
      await session.abortTransaction();
      return res.status(400).send({
        success: false,
        message: "Shipping address and contact phone are required",
      });
    }

    const productIds = items.map((item) => item.productId);
    const products = await productModel.find({ _id: { $in: productIds } }).session(session);

    if (products.length !== productIds.length) {
      await session.abortTransaction();
      return res.status(400).send({
        success: false,
        message: "One or more products no longer exist",
      });
    }

    const productMap = new Map(products.map((product) => [String(product._id), product]));

    const orderItems = [];
    for (const item of items) {
      const product = productMap.get(String(item.productId));
      const quantity = Number(item.quantity || 0);

      if (!product || quantity <= 0) {
        await session.abortTransaction();
        return res.status(400).send({
          success: false,
          message: "Invalid order items provided",
        });
      }

      if (product.quantity < quantity) {
        await session.abortTransaction();
        return res.status(400).send({
          success: false,
          message: `${product.name} is out of stock for the requested quantity`,
        });
      }

      product.quantity -= quantity;
      await product.save({ session });

      orderItems.push({
        product: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        quantity,
        photoUrl: `/api/v1/product/product-photo/${product._id}`,
      });
    }

    const totals = calculateTotals(orderItems);
    const paymentStatus = paymentMethod === "cod" ? "pending" : "paid";

    const order = await orderModel.create(
      [
        {
          user: req.user._id,
          items: orderItems,
          ...totals,
          payment: {
            method: paymentMethod,
            status: paymentStatus,
            transactionId: `txn_${crypto.randomUUID()}`,
          },
          shippingAddress,
          contactPhone,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return res.status(201).send({
      success: true,
      message: "Order placed successfully",
      order: order[0],
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).send({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const getMyOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

export const getAllOrdersController = async (_req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to fetch admin orders",
      error: error.message,
    });
  }
};

export const updateOrderStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["processing", "confirmed", "shipped", "delivered", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).send({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await orderModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).send({ success: false, message: "Order not found" });
    }

    return res.status(200).send({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

export const getAdminSummaryController = async (_req, res) => {
  try {
    const [users, products, orders, revenue] = await Promise.all([
      userModel.countDocuments({}),
      productModel.countDocuments({}),
      orderModel.countDocuments({}),
      orderModel.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
    ]);

    return res.status(200).send({
      success: true,
      summary: {
        users,
        products,
        orders,
        revenue: revenue[0]?.total || 0,
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
};
