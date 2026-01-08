import { Router } from "express";
import {
  getOverviewStats,
  getOverviewByMonth,
  getTopRevenueMovies,
} from "./overview.controller.js";

const router = Router();

router.get("/", getOverviewStats);
router.get("/month-of-year", getOverviewByMonth);
router.get("/trend-movies", getTopRevenueMovies);

export default router;
