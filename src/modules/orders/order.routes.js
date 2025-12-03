import { Router } from "express";
import { checkout } from "./order.controller.js";

const checkoutRoute = Router();
checkoutRoute.post("/", checkout);

export default checkoutRoute;

