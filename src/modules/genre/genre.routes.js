import { Router } from "express";
import {
  createGenre,
  updateGenre,
  updateStatusGenre,
} from "./genre.controller.js";

const genreRoute = Router();

genreRoute.post("/", createGenre);
genreRoute.patch("/update/:id", updateGenre);
genreRoute.patch("/status/:id", updateStatusGenre);
export default genreRoute;
