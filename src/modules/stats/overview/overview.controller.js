import dayjs from "dayjs";
import handleAsync from "../../../common/utils/async-handler.js";
import createResponse from "../../../common/utils/create-response.js";

import { applyQuickFilter } from "../stats.utils.js";
import {
  getOverviewStatsService,
  getOverviewByMonthService,
  getTopRevenueMoviesService,
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
