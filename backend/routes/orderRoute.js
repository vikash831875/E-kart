import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  getOrderDashboard,
} from "../controllers/orderController.js";
import { isAuthenticated, isAdmin } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/create", isAuthenticated, createOrder);
router.get("/my-orders", isAuthenticated, getUserOrders);
router.get("/all", isAuthenticated, isAdmin, getAllOrders);
router.get("/user/:userId", isAuthenticated, isAdmin, getOrdersByUser);
router.get("/dashboard", isAuthenticated, isAdmin, getOrderDashboard);
router.get("/:orderId", isAuthenticated, getOrderById);
router.put("/:orderId/status", isAuthenticated, isAdmin, updateOrderStatus);

export default router;
