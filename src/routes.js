import { Router } from "express";
import authRoute from "./modules/auth/auth.routes";

const routes = Router();

routes.use("/auth", authRoute);

export default routes;
