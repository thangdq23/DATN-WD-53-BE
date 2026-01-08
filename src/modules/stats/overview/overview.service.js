import Order from "../../orders/order.model.js";
import Showtime from "../../showtimes/showtime.model.js";
import Room from "../../rooms/room.model.js";
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

export const getOverviewByRangeService = async (
  createdAtRange,
  granularity = "day",
) => {
  let format = "%Y-%m-%d";
  if (granularity === "hour") format = "%Y-%m-%d %H";
  if (granularity === "month") format = "%Y-%m";
  if (granularity === "year") format = "%Y";

  const data = await Order.aggregate([
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
            format,
            date: "$createdAt",
            timezone: "Asia/Ho_Chi_Minh",
          },
        },
        revenue: { $sum: "$totalAmount" },
        tickets: { $sum: { $size: "$seats" } },
        orders: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        period: "$_id",
        revenue: 1,
        tickets: 1,
        orders: 1,
      },
    },
    { $sort: { period: 1 } },
  ]);

  return data;
};

export const getTopMoviesByTicketsService = async (query) => {
  const { current } = resolveCompareRanges(query.createdAt);

  const raw = await Order.aggregate([
    { $match: { ...current, isPaid: true, status: { $in: SUCCESS_STATUSES } } },
    {
      $group: {
        _id: "$movieId",
        movieName: { $first: "$movieName" },
        poster: { $first: "$moviePoster" },
        tickets: { $sum: { $size: "$seats" } },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { tickets: -1, revenue: -1 } },
    { $limit: 5 },
  ]);

  return { result: raw, queryTime: normalizeQueryTime(query) };
};

export const getShowtimeStatsService = async (query) => {
  const { current } = resolveCompareRanges(query.createdAt);

  // total showtimes in timeframe
  const from = current?.createdAt?.$gte ? current.createdAt.$gte : new Date(0);
  const to = current?.createdAt?.$lte ? current.createdAt.$lte : new Date();
  const totalShowtimes = await Showtime.countDocuments({
    startTime: { $gte: from, $lte: to },
  });

  // showtime tickets and revenue from orders
  const raw = await Order.aggregate([
    { $match: { ...current, isPaid: true, status: { $in: SUCCESS_STATUSES } } },
    {
      $group: {
        _id: "$showtimeId",
        showtimeId: { $first: "$showtimeId" },
        movieName: { $first: "$movieName" },
        startTime: { $first: "$startTime" },
        tickets: { $sum: { $size: "$seats" } },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { tickets: -1, revenue: -1 } },
  ]);

  const mostPopular = raw[0] || null;
  const highestRevenue = raw.sort((a, b) => b.revenue - a.revenue)[0] || null;

  return {
    totalShowtimes,
    mostPopular,
    highestRevenue,
    queryTime: normalizeQueryTime(query),
  };
};

export const getRoomStatsService = async (query) => {
  const { current } = resolveCompareRanges(query.createdAt);

  const totalRooms = await Room.countDocuments();

  // occupancy per showtime: seats sold / room.capacity
  const occupancy = await Order.aggregate([
    { $match: { ...current, isPaid: true, status: { $in: SUCCESS_STATUSES } } },
    {
      $group: {
        _id: "$showtimeId",
        roomId: { $first: "$roomId" },
        sold: { $sum: { $size: "$seats" } },
      },
    },
    {
      $lookup: {
        from: "rooms",
        localField: "roomId",
        foreignField: "_id",
        as: "room",
      },
    },
    { $unwind: { path: "$room", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        sold: 1,
        capacity: "$room.capacity",
        occupancy: {
          $cond: [
            { $gt: ["$room.capacity", 0] },
            { $multiply: [{ $divide: ["$sold", "$room.capacity"] }, 100] },
            0,
          ],
        },
      },
    },
  ]);

  const avgOccupancy = occupancy.length
    ? Number(
        (
          occupancy.reduce((s, r) => s + (r.occupancy || 0), 0) /
          occupancy.length
        ).toFixed(1),
      )
    : 0;

  return { totalRooms, avgOccupancy, queryTime: normalizeQueryTime(query) };
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
