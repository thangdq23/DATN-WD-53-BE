import cors from "cors";
import express from "express";
import morgan from "morgan";
import { NODE_ENV, PORT } from "./src/common/configs/environment.js";
import errorHandler from "./src/common/middlewares/error.middleware.js";
import jsonValidator from "./src/common/middlewares/json-valid.middleware.js";
import notFoundHandler from "./src/common/middlewares/not-found.middleware.js";
import routes from "./src/routes.js";
import { checkVersion } from "./src/common/configs/node-version.js";
import connectDB from "./src/common/configs/database.js";
import dotenv from "dotenv";
import { movieStatusJob } from "./src/jobs/statusMovieJob.js";
import { seatStatusJob } from "./src/jobs/seatStatusJob.js";
import { initSocket } from "./src/modules/socket/index.js";
import http from "http";
import { showtimeStatusJob } from "./src/jobs/statusShowtimeJob.js";
checkVersion();
dotenv.config({});
const app = express();

app.use(express.json());
app.use(cors());
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.get("/", (_, res) => res.json("hello word"));
app.use("/api", routes);

app.use(jsonValidator);
app.use(notFoundHandler);
app.use(errorHandler);

let server;

connectDB()
  .then(() => {
    console.log("✓ Connected to MongoDB");
    server = http.createServer(app);
    initSocket(server);
    showtimeStatusJob();
    seatStatusJob();
    movieStatusJob();
    server.listen(PORT, () => {
      console.log("API Server Started");
      if (NODE_ENV === "development") {
        console.log(`• API: http://localhost:${PORT}/api`);
      }
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err);
    process.exit(1);
  });

process.on("unhandledRejection", (error) => {
  console.error(`Error: ${error.message}`);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});
