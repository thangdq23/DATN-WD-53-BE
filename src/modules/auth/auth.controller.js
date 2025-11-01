import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { loginService, registerService } from "./auth.service.js";

export const register = handleAsync(async (req, res, next) => {
  const user = await registerService(req.body);
  return createResponse(res, 201, "Đăng ký thành công", user);
});

export const login = handleAsync(async (req, res, next) => {
  const response = await loginService(req.body);
  return createResponse(res, 200, "Đăng nhập thành công", response);
});
