/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *         - year
 *         - genre
 *         - trailer
 *         - image
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the movie
 *         year:
 *           type: number
 *           description: The release year of the movie
 *         description:
 *           type: string
 *           description: Brief description of the movie
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *           description: Genres associated with the movie
 *         trailer:
 *           type: string
 *           description: URL to the movie trailer
 *         image:
 *           type: string
 *           description: URL to the movie poster image
 *         rating:
 *           type: object
 *           properties:
 *             imdb:
 *               type: number
 *               description: IMDb rating of the movie
 *             rottenTomatoes:
 *               type: number
 *               description: Rotten Tomatoes rating of the movie
 */
import mongoose, { Document } from "mongoose";

export interface IComment extends Document {
  user: string;
  text: string;
  createdAt: Date;
}

export interface IMovie extends Document {
  title: string;
  year: number;
  description?: string;
  genre: string[];
  trailer: string;
  image: string;
  rating?: {
    imdb?: number;
    rottenTomatoes?: number;
  };
  createdAt: Date;
  comments: IComment[];
}

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
});

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  description: { type: String },
  genre: [{ type: String, required: true }],
  trailer: { type: String, required: true },
  image: { type: String, required: true, default: "default.png" },
  rating: {
    imdb: { type: Number },
    rottenTomatoes: { type: Number },
  },
  createdAt: { type: Date, default: Date.now() },
  comments: [CommentSchema],
});

export default mongoose.model<IMovie>("Movie", MovieSchema);
