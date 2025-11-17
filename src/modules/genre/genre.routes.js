import { Router } from "express";
import {
  createGenre,
  getAllGenre,
  getDetailGenre,
  updateGenre,
  updateStatusGenre,
} from "./genre.controller.js";

const genreRoute = Router();

genreRoute.get("/", getAllGenre);
genreRoute.get("/detail/:id", getDetailGenre);
genreRoute.post("/", createGenre);
genreRoute.patch("/update/:id", updateGenre);
genreRoute.patch("/status/:id", updateStatusGenre);

export default genreRoute;
