import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { checkoutService } from "./order.service.js";

export const checkout = handleAsync(async (req, res) => {
  const { body } = req;
  const data = await checkoutService(body);
  return createResponse(res, 201, "Đặt vé thành công", data);
});
