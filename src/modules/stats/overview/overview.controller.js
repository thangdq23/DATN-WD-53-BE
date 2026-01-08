import dayjs from "dayjs";
import handleAsync from "../../../common/utils/async-handler.js";
import createResponse from "../../../common/utils/create-response.js";

import { applyQuickFilter } from "../stats.utils.js";
import {
  getOverviewStatsService,
  getOverviewByMonthService,
  getTopRevenueMoviesService,
  getOverviewByRangeService,
  getTopMoviesByTicketsService,
  getShowtimeStatsService,
  getRoomStatsService,
} from "./overview.service.js";
import { applyFilter } from "../../../common/utils/api-query.js";

export const getOverviewStats = handleAsync(async (req, res) => {
  const match = {};
  Object.entries(req.query).forEach(([k, v]) => applyFilter(k, v, match));

  if (match.quickFilter) {
    const { createdAtFrom, createdAtTo } = applyQuickFilter(match.quickFilter);
    match.createdAt = { $gte: createdAtFrom, $lte: createdAtTo };
    delete match.quickFilter;
  }

  const data = await getOverviewStatsService(match);
  return createResponse(res, 200, "OK", data);
});

export const getOverviewByMonth = handleAsync(async (req, res) => {
  const year = Number(req.query.year) || dayjs().year();
  const start = dayjs().year(year).startOf("year");
  const end = dayjs().year(year).endOf("year");

  const data = await getOverviewByMonthService({
    $gte: start.toDate(),
    $lte: end.toDate(),
  });

  const result = Array.from({ length: 12 }, (_, i) => {
    const key = start.add(i, "month").format("YYYY-MM");
    const found = data.find((d) => d.month === key);
    return {
      month: key,
      revenue: found?.revenue || 0,
      orders: found?.orders || 0,
    };
  });

  return createResponse(res, 200, "OK", { year, result });
});

export const getTopRevenueMovies = handleAsync(async (req, res) => {
  const match = {};
  Object.entries(req.query).forEach(([k, v]) => applyFilter(k, v, match));

  if (match.quickFilter) {
    const { createdAtFrom, createdAtTo } = applyQuickFilter(match.quickFilter);
    match.createdAt = { $gte: createdAtFrom, $lte: createdAtTo };
    delete match.quickFilter;
  }

  const data = await getTopRevenueMoviesService(match);
  return createResponse(res, 200, "OK", data);
});

export const getOverviewByRange = handleAsync(async (req, res) => {
  const { granularity = "day", createdAtFrom, createdAtTo } = req.query;
  const range = {
    $gte: createdAtFrom ? new Date(createdAtFrom) : new Date(0),
    $lte: createdAtTo ? new Date(createdAtTo) : new Date(),
  };

  const data = await getOverviewByRangeService(range, granularity);
  return createResponse(res, 200, "OK", { granularity, result: data });
});

export const getTopMoviesByTickets = handleAsync(async (req, res) => {
  const match = {};
  Object.entries(req.query).forEach(([k, v]) => applyFilter(k, v, match));
  if (match.quickFilter) {
    const { createdAtFrom, createdAtTo } = applyQuickFilter(match.quickFilter);
    match.createdAt = { $gte: createdAtFrom, $lte: createdAtTo };
    delete match.quickFilter;
  }

  const data = await getTopMoviesByTicketsService(match);
  return createResponse(res, 200, "OK", data);
});

export const getShowtimeStats = handleAsync(async (req, res) => {
  const match = {};
  Object.entries(req.query).forEach(([k, v]) => applyFilter(k, v, match));
  if (match.quickFilter) {
    const { createdAtFrom, createdAtTo } = applyQuickFilter(match.quickFilter);
    match.createdAt = { $gte: createdAtFrom, $lte: createdAtTo };
    delete match.quickFilter;
  }

  const data = await getShowtimeStatsService(match);
  return createResponse(res, 200, "OK", data);
});

export const getRoomStats = handleAsync(async (req, res) => {
  const match = {};
  Object.entries(req.query).forEach(([k, v]) => applyFilter(k, v, match));
  if (match.quickFilter) {
    const { createdAtFrom, createdAtTo } = applyQuickFilter(match.quickFilter);
    match.createdAt = { $gte: createdAtFrom, $lte: createdAtTo };
    delete match.quickFilter;
  }

  const data = await getRoomStatsService(match);
  return createResponse(res, 200, "OK", data);
});
