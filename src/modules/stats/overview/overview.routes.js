import { Router } from "express";
import {
  getOverviewStats,
  getOverviewByMonth,
  getTopRevenueMovies,
  getOverviewByRange,
  getTopMoviesByTickets,
  getShowtimeStats,
  getRoomStats,
} from "./overview.controller.js";

const router = Router();

router.get("/", getOverviewStats);
router.get("/month-of-year", getOverviewByMonth);
router.get("/trend-movies", getTopRevenueMovies);
router.get("/range", getOverviewByRange);
router.get("/top-by-tickets", getTopMoviesByTickets);
router.get("/showtime-stats", getShowtimeStats);
router.get("/room-stats", getRoomStats);

export default router;
