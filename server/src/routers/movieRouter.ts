import { Router } from "express";
import MovieController from "../controllers/MovieController.js";
import { checkRoles } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Retrieve all movies
 *     description: Retrieve a list of all movies
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
router.get(
  "/movies",
  checkRoles(["USER", "ADMIN"]),
  MovieController.getAllMovies
);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Retrieve a movie by ID
 *     description: Retrieve a single movie by its ID
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the movie to retrieve
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A single movie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovieInput'
 */
router.get("/movies/:id", checkRoles(["ADMIN"]), MovieController.getMovieById);

/**
 * @swagger
 * /api/movies/create:
 *   post:
 *     summary: Create a new movie
 *     description: Create a new movie
 *     tags:
 *       - Movies
 *     security:
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
router.post(
  "/movies/create",
  checkRoles(["ADMIN"]),
  MovieController.createMovie
);

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Update an existing movie
 *     description: Update an existing movie by its ID
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the movie to update
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
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
 */
router.put("/movies/:id", checkRoles(["ADMIN"]), MovieController.updateMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     description: Delete a movie by its ID
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the movie to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
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
router.delete(
  "/movies/:id",
  checkRoles(["ADMIN"]),
  MovieController.deleteMovie
);

export default router;
