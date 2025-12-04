import { apiQuery } from "../../common/utils/api-query.js";
import { throwError } from "../../common/utils/create-response.js";
import User from "./user.model.js";
import bcrypt from "bcryptjs";

export const getAllUserService = async (query) => {
  const data = await apiQuery(User, query);
  return data;
};

export const createUserService = async (data) => {
  const { email } = data;

  const existedEmail = await User.findOne({ email });
  if (existedEmail) {
    throwError(400, "Email đã tồn tại!");
  }

  const hashedPassword = await bcrypt.hash("MPV@123", 10);
  const newUser = await User.create({
    ...data,
    password: hashedPassword,
  });

  return newUser;
};

export const updateUserService = async (id, data) => {
  const user = await User.findById(id);
  if (!user) throwError(404, "Không tìm thấy user!");

  if (data.email && data.email !== user.email) {
    const existedEmail = await User.findOne({ email: data.email });
    if (existedEmail) throwError(400, "Email đã được sử dụng!");
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const updated = await User.findByIdAndUpdate(id, data, { new: true });
};
