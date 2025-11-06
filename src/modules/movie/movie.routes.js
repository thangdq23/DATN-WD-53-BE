import { Router } from "express";
import {
  createMovie,
  getAllMovie,
  getDetailMovie,
  updateMovie,
  updateStatusMovie,
} from "./movie.controller.js";

const movieRoute = Router();

movieRoute.get("/", getAllMovie);
movieRoute.get("/detail/:id", getDetailMovie);
movieRoute.post("/", createMovie);
movieRoute.patch("/update/:id", updateMovie);
movieRoute.patch("/status/:id", updateStatusMovie);

export default movieRoute;
