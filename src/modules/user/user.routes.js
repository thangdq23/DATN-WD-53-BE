import { Router } from "express";
import {
  createUser,
  getAllUser,
  updateUser,
  changePassword,
} from "./user.controller.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";

const userRoute = Router();
userRoute.get("/", getAllUser);
userRoute.post("/", createUser);
userRoute.patch("/update/:id", updateUser);
userRoute.patch("/change-password", authenticate(), changePassword);
export default userRoute;
