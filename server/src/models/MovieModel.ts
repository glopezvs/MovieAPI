import mongoose, { Document } from "mongoose";

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
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         year:
 *           type: number
 *         description:
 *           type: string
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *         trailer:
 *           type: string
 *         image:
 *           type: string
 *         rating:
 *           type: object
 *           properties:
 *             imdb:
 *               type: number
 *             rottenTomatoes:
 *               type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 */

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
});

export default mongoose.model<IMovie>("Movie", MovieSchema);
