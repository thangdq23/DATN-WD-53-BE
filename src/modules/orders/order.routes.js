import { Router } from "express";
import {
  checkout,
  checkoutReturnPayos,
  getAllOrder,
  getDetailOrder,
  getMyOrders,
  verifyOrder,
  updateOrderStatus,
} from "./order.controller.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { JWT_ACCESS_SECRET } from "../../common/configs/environment.js";

const orderRoute = Router();
orderRoute.post("/", authenticate(JWT_ACCESS_SECRET), checkout);
orderRoute.get("/", getAllOrder);
orderRoute.get("/my", authenticate(JWT_ACCESS_SECRET), getMyOrders);
orderRoute.get("/detail/:id", getDetailOrder);
orderRoute.get("/verify", verifyOrder);
orderRoute.patch("/:id", authenticate(JWT_ACCESS_SECRET), updateOrderStatus);
orderRoute.get("/return", checkoutReturnPayos);
export default orderRoute;
