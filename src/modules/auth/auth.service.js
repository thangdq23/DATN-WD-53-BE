import {
  JWT_ACCESS_EXPIRED,
  JWT_ACCESS_SECRET,
} from "../../common/configs/environment.js";
import {
  throwError,
  throwIfDuplicate,
} from "../../common/utils/create-response.js";
import User from "../user/user.model.js";
import { comparePassword, generateToken, hashPassword } from "./auth.utils.js";

export const registerService = async (payload) => {
  const { email, password } = payload;
  const existingUser = await User.findOne({
    $or: [{ email }],
  });

  if (existingUser) {
    const { email: existingEmail } = existingUser;
    throwIfDuplicate(email, existingEmail, "Email đã tồn tại trong hệ thống!");
  }
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    ...payload,
    password: hashedPassword,
  });
  await user.save();
  return user;
};

export const loginService = async (payload) => {
  const { email, password } = payload;
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    throwError(400, "Thông tin đăng nhập không chính xác!");
  }
  const checkPassword = await comparePassword(password, foundUser.password);
  if (!checkPassword) {
    throwError(400, "Thông tin đăng nhập không chính xác!");
  }
  const payloadToken = {
    _id: foundUser._id,
    role: foundUser.role,
  };
  const accessToken = generateToken(
    payloadToken,
    JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRED,
  );

  return { user: foundUser, accessToken };
};
