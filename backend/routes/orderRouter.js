import express from "express";

import {
  createOrder,
  getMyOrders,
  getOwnerOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

import isAuth from "../middlewares/isAuth.js";

const orderRouter = express.Router();
orderRouter.put(
  "/update-status/:orderId",
  isAuth,
  updateOrderStatus
);
orderRouter.post(
  "/create",
  isAuth,
  createOrder
);

orderRouter.get(
  "/my-orders",
  isAuth,
  getMyOrders
);

orderRouter.get(
  "/owner-orders",
  isAuth,
  getOwnerOrders
);

export default orderRouter;