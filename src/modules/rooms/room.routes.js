import { Router } from "express";
import { createRoom, updateRoom } from "./room.controller";

const roomRouter = Router();
roomRouter.post("/", createRoom);
roomRouter.patch("/update/:id", updateRoom);
export default roomRouter;
