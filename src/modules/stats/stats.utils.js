import dayjs from "dayjs";

export const applyQuickFilter = (quickFilter) => {
  const now = dayjs();
  let from = now.startOf("day");
  let to = now.endOf("day");

  switch (quickFilter) {
    case "today":
      break;
    case "yesterday":
      from = now.subtract(1, "day").startOf("day");
      to = now.subtract(1, "day").endOf("day");
      break;
    case "this_week":
      from = now.startOf("week");
      to = now.endOf("week");
      break;
    case "last_week":
      from = now.subtract(1, "week").startOf("week");
      to = now.subtract(1, "week").endOf("week");
      break;
    case "this_month":
      from = now.startOf("month");
      to = now.endOf("month");
      break;
    case "last_month":
      from = now.subtract(1, "month").startOf("month");
      to = now.subtract(1, "month").endOf("month");
      break;
    case "this_year":
      from = now.startOf("year");
      to = now.endOf("year");
      break;
    default:
      from = now.subtract(30, "day").startOf("day");
      to = now.endOf("day");
  }

  return {
    createdAtFrom: from.toDate(),
    createdAtTo: to.toDate(),
  };
};

export const resolveCompareRanges = (createdAt) => {
  const to = createdAt?.$lte ? dayjs(createdAt.$lte) : dayjs();
  const from = createdAt?.$gte
    ? dayjs(createdAt.$gte)
    : dayjs().subtract(30, "day");

  const diff = to.valueOf() - from.valueOf();
  const prevTo = from.subtract(1, "millisecond");
  const prevFrom = dayjs(prevTo.valueOf() - diff);

  return {
    current: { createdAt: { $gte: from.toDate(), $lte: to.toDate() } },
    previous: { createdAt: { $gte: prevFrom.toDate(), $lte: prevTo.toDate() } },
  };
};

export const normalizeQueryTime = (range) => ({
  from: range?.createdAt?.$gte,
  to: range?.createdAt?.$lte,
});
