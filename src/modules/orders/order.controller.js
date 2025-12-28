import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { checkoutService } from "./order.service.js";
import { getMyOrdersService } from "./order.service.js";

export const checkout = handleAsync(async (req, res) => {
  const { body } = req;
  const userId = req.user._id;
  if (userId) body.userId = userId;
  const data = await checkoutService(body);
  return createResponse(res, 201, "Đặt vé thành công", data);
});

export const getMyOrders = handleAsync(async (req, res) => {
  const userId = req.user._id;
  const { query } = req;
  const { data, meta } = await getMyOrdersService(userId, query);
  return createResponse(res, 200, "OK", data, meta);
});
