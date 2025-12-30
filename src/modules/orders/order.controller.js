import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import {
  checkoutReturnPayosService,
  checkoutService,
  getAllOrderService,
  getDetailOrderService,
  getMyOrdersService,
} from "./order.service.js";

export const checkout = handleAsync(async (req, res) => {
  const { body } = req;
  const userId = req.user._id;
  if (userId) body.userId = userId;
  const data = await checkoutService(body);
  return createResponse(res, 201, "Đặt vé thành công", data);
});

export const getAllOrder = handleAsync(async (req, res) => {
  const { query } = req;
  const { data, meta } = await getAllOrderService(query);
  return createResponse(res, 200, "OK", data, meta);
});

export const getMyOrders = handleAsync(async (req, res) => {
  const userId = req.user._id;
  const { query } = req;
  const { data, meta } = await getMyOrdersService(userId, query);
  return createResponse(res, 200, "OK", data, meta);
});

export const getDetailOrder = handleAsync(async (req, res) => {
  const { id } = req.params;
  const data = await getDetailOrderService(id);
  return createResponse(res, 200, "OK", data);
});

export const checkoutReturnPayos = handleAsync(async (req, res) => {
  const { query } = req;
  if (!query.status || query.status === "CANCELLED") {
    return res.redirect("http://localhost:5173/payment/failed");
  }
  const data = await checkoutReturnPayosService(query);
  if (!data) {
    res.redirect("http://localhost:5173/payment/failed");
  }
  return res.redirect(`http://localhost:5173/payment/success/${data._id}`);
});
