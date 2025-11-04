import { Router } from "express";
import authRoute from "./modules/auth/auth.routes.js";
import genreRoute from "./modules/genre/genre.routes.js";

const routes = Router();

routes.use("/auth", authRoute);
routes.use("/genre", genreRoute);

export default routes;
