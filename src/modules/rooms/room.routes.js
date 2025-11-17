import { Router } from "express";
import { createRoom, updateRoom } from "./room.controller.js";

const roomRoute = Router();
roomRoute.post("/", createRoom);
roomRoute.patch("/update/:id", updateRoom);
export default roomRoute;
