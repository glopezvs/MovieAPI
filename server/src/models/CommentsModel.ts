// 1. Define the Comment Model
import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  text: string;
  userId: string;
  movieId: string;
  createdAt: Date;
}

const CommentSchema = new Schema({
  text: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  movieId: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
  createdAt: { type: Date, default: Date.now },
});

const CommentModel = mongoose.model<IComment>("Comment", CommentSchema);

export default CommentModel;
