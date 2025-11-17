import { Router } from "express";
import authRoute from "./modules/auth/auth.routes.js";
import genreRoute from "./modules/genre/genre.routes.js";
import movieRoute from "./modules/movie/movie.routes.js";
import roomRouter from "./modules/rooms/room.routes.js";


const routes = Router();

routes.use("/auth", authRoute);
routes.use("/genre", genreRoute);
routes.use("/movie", movieRoute);
routes.use("/room", roomRouter);


export default routes;
