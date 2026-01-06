import Order from "../../orders/order.model.js";
import { normalizeQueryTime, resolveCompareRanges } from "../stats.utils.js";
import { aggregateOverviewOrderStats, calcGrowth } from "./overview.utils.js";

const SUCCESS_STATUSES = ["buyed", "used"];

export const getOverviewStatsService = async (query) => {
  const { current, previous } = resolveCompareRanges(query.createdAt);

  const [cur, prev] = await Promise.all([
    aggregateOverviewOrderStats(current),
    aggregateOverviewOrderStats(previous),
  ]);

  return {
    order: {
      total: cur.totalOrders,
      previous: prev.totalOrders,
      growth: calcGrowth(cur.totalOrders, prev.totalOrders),
    },
    revenue: {
      total: cur.totalRevenue,
      previous: prev.totalRevenue,
      growth: calcGrowth(cur.totalRevenue, prev.totalRevenue),
    },
    queryTime: {
      current: normalizeQueryTime(current),
      previous: normalizeQueryTime(previous),
    },
  };
};

export const getOverviewByMonthService = async (createdAtRange) => {
  return Order.aggregate([
    {
      $match: {
        createdAt: createdAtRange,
        isPaid: true,
        status: { $in: SUCCESS_STATUSES },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m",
            date: "$createdAt",
            timezone: "Asia/Ho_Chi_Minh",
          },
        },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        revenue: 1,
        orders: 1,
      },
    },
    { $sort: { month: 1 } },
  ]);
};

export const getTopRevenueMoviesService = async (query) => {
  const { current } = resolveCompareRanges(query.createdAt);

  const raw = await Order.aggregate([
    {
      $match: {
        ...current,
        isPaid: true,
        status: { $in: SUCCESS_STATUSES },
      },
    },
    {
      $group: {
        _id: "$movieId",
        movieName: { $first: "$movieName" },
        poster: { $first: "$moviePoster" },
        revenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1, totalOrders: -1 } },
    { $limit: 5 },
  ]);

  return {
    result: raw,
    queryTime: normalizeQueryTime(query),
  };
};
