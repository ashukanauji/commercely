import express from "express";
import {
  forgotPasswordController,
  getProfileController,
  getUsersController,
  loginController,
  registerController,
  testController,
  updateProfileController,
  updateUserRoleController,
} from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.get("/test", requireSignIn, isAdmin, testController);
router.get("/user-auth", requireSignIn, (_req, res) => res.status(200).send({ ok: true }));
router.get("/admin-auth", requireSignIn, isAdmin, (_req, res) => res.status(200).send({ ok: true }));
router.get("/profile", requireSignIn, getProfileController);
router.put("/profile", requireSignIn, updateProfileController);
router.get("/users", requireSignIn, isAdmin, getUsersController);
router.put("/users/:id/role", requireSignIn, isAdmin, updateUserRoleController);

export default router;
