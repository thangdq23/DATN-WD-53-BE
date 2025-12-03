import { Router } from "express";
import { createUser, getAllUser, updateUser } from "./user.controller.js";

const userRoute = Router();
userRoute.get("/", getAllUser);
userRoute.post("/", createUser);
userRoute.patch("/update/:id", updateUser);
export default userRoute;
