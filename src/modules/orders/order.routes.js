import { Router } from "express";
import { checkout, getMyOrders } from "./order.controller.js";

const checkoutRoute = Router();
checkoutRoute.post("/", checkout);
checkoutRoute.get("/my/:userId", getMyOrders);

export default checkoutRoute;
