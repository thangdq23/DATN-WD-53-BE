import { Router } from "express";
import authRoute from "./modules/auth/auth.routes.js";
import genreRoute from "./modules/genre/genre.routes.js";
import movieRoute from "./modules/movie/movie.routes.js";
import roomRoute from "./modules/rooms/room.routes.js";

import orderRoute from "./modules/orders/order.routes.js";
import seatStatusRoute from "./modules/seat-status/seat.status.routes.js";
import seatRoute from "./modules/seat/seat.route.js";
import showtimeRoute from "./modules/showtimes/showtime.routes.js";
import userRoute from "./modules/user/user.routes.js";

const routes = Router();

routes.use("/auth", authRoute);
routes.use("/genre", genreRoute);
routes.use("/movie", movieRoute);
routes.use("/room", roomRoute);
routes.use("/showtime", showtimeRoute);
routes.use("/seat-status", seatStatusRoute);
routes.use("/order", orderRoute);
routes.use("/user", userRoute);
routes.use("/seat", seatRoute);

export default routes;
