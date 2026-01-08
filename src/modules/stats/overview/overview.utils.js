import Order from "../../orders/order.model.js";

const SUCCESS_STATUSES = ["buyed", "used"];

export const aggregateOverviewOrderStats = async (match) => {
  const [res] = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalOrders: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$isPaid", true] },
                  { $in: ["$status", SUCCESS_STATUSES] },
                ],
              },
              1,
              0,
            ],
          },
        },
        totalRevenue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$isPaid", true] },
                  { $in: ["$status", SUCCESS_STATUSES] },
                ],
              },
              "$totalAmount",
              0,
            ],
          },
        },
      },
    },
  ]);

  return {
    totalOrders: res?.totalOrders || 0,
    totalRevenue: res?.totalRevenue || 0,
  };
};

export const calcGrowth = (cur, prev) => {
  if (prev === 0 && cur > 0) return 100;
  if (cur === 0) return 0;
  return Number((((cur - prev) / prev) * 100).toFixed(1));
};
