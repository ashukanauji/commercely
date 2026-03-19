import express from "express";
import {
  createOrderController,
  getAdminSummaryController,
  getAllOrdersController,
  getMyOrdersController,
  updateOrderStatusController,
} from "../controller/orderController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/checkout", requireSignIn, createOrderController);
router.get("/my-orders", requireSignIn, getMyOrdersController);
router.get("/admin/orders", requireSignIn, isAdmin, getAllOrdersController);
router.put("/admin/orders/:id/status", requireSignIn, isAdmin, updateOrderStatusController);
router.get("/admin/summary", requireSignIn, isAdmin, getAdminSummaryController);

export default router;
