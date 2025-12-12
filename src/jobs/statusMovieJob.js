import cron from "node-cron";
import dayjs from "dayjs";
import Movie from "../modules/movie/movie.model.js";

export const startMovieStatusJob = async () => {
  try {
    const today = dayjs().startOf("day").toDate();
    await Movie.updateMany({}, [
      {
        $set: {
          statusRelease: {
            $switch: {
              branches: [
                { case: { $lt: [today, "$releaseDate"] }, then: "upcoming" },
                { case: { $gt: [today, "$endDate"] }, then: "released" },
              ],
              default: "nowShowing",
            },
          },
        },
      },
    ]);
    console.log("Cập nhật statusRelease cho tất cả phim thành công!");
  } catch (err) {
    console.log("Lỗi khi cập nhật statusRelease:" , err);
  }
};

let isCronStarted =  false;

export const movieStatusJob = () => {
  if (isCronStarted) return;
  isCronStarted = true;
  console.log("START MOVIE STATUS CRON JOB");
  startMovieStatusJob();
  cron.schedule(
    "0 0 * * *",
    async () => {
      console.log("CRON: Updating movie status");
      await startMovieStatusJob();
    },
    {
      timezone: "Asia/Ho_Chi_Minh",
    },
  );
};