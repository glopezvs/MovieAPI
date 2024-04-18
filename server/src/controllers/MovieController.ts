import { Request, Response } from "express";
import MovieModel from "../models/MovieModel.js";

class MovieController {
  /**
   * @swagger
   * /api/movies:
   *   get:
   *     summary: Get all movies
   *     description: Get a list of all movies
   *     tags:
   *       - Movies
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: A list of movies
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/MovieInput'
   */
  async getAllMovies(req: Request, res: Response) {
    try {
      const movies = await MovieModel.find();
      return res.json(movies);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @swagger
   * /api/movies/{id}:
   *   get:
   *     summary: Get movie by ID
   *     description: Get a single movie by its ID
   *     tags:
   *       - Movies
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the movie to retrieve
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A single movie
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovieInput'
   *       404:
   *         description: Movie not found
   */
  async getMovieById(req: Request, res: Response) {
    try {
      const movie = await MovieModel.findById(req.params.id);
      if (!movie) {
        return res.status(404).json({ error: "Movie not found." });
      }
      return res.json(movie);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @swagger
   * /api/movies/create:
   *   post:
   *     summary: Create a new movie
   *     description: Create a new movie
   *     tags:
   *       - Movies
   *    security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MovieInput'
   *     responses:
   *       201:
   *         description: The created movie
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovieInput'
   */
  async createMovie(req: Request, res: Response) {
    try {
      const newMovie = await MovieModel.create(req.body);
      return res
        .status(201)
        .json({ message: "Movie created successfully", movie: newMovie });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  /**
   * @swagger
   * /api/movies/{id}:
   *   put:
   *     summary: Update an existing movie
   *     description: Update an existing movie by its ID
   *     tags:
   *       - Movies
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the movie to update
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MovieInput'
   *     responses:
   *       200:
   *         description: The updated movie
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovieInput'
   *       404:
   *         description: Movie not found
   */
  async updateMovie(req: Request, res: Response) {
    try {
      const updatedMovie = await MovieModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedMovie) {
        return res.status(404).json({ error: "Movie not found." });
      }
      return res.json({
        message: "Movie updated successfully",
        movie: updatedMovie,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @swagger
   * /api/movies/{id}:
   *   delete:
   *     summary: Delete a movie
   *     description: Delete a movie by its ID
   *     tags:
   *       - Movies
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the movie to delete
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Success message
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   */
  async deleteMovie(req: Request, res: Response) {
    try {
      const deletedMovie = await MovieModel.findByIdAndDelete(req.params.id);
      if (!deletedMovie) {
        return res.status(404).json({ error: "Movie not found." });
      }
      return res.json({
        message: "Movie deleted successfully",
        movie: deletedMovie,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new MovieController();
