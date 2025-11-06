import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    poster: {
      type: String,
      required: true,
    },
    genreIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],
    trailer: {
      type: String,
    },
    actor: {
      type: [String],
      required: true,
    },
    director: {
      type: String,
    },
    rating: {
      type: Number,
      default: 5,
    },
    ageRestriction: {
      type: String,
      enum: ["P", "K", "C13", "C16", "C18"],
      default: "P",
    },
    duration: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    subTitleLanguage: {
      type: String,
      required: true,
    },
    isHot: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
