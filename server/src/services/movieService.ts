import { v4 as uuidv4 } from "uuid";
import jsonFileReader from "../utils/jsonFileReader.js";
import FileService from "../utils/FileService.js";
import { IMovie } from "../interfaces/interfaces.js";

const moviesPath = "./src/data/movies.json";

class MovieService {
  /**
   * @swagger
   * components:
   *   schemas:
   *     Movie:
   *       type: object
   *       properties:
   *         id:
   *           type: string
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
   */

  /**
   * @swagger
   * /api/movies:
   *   get:
   *     summary: Retrieve all movies
   *     tags: [Movies]
   *     responses:
   *       200:
   *         description: A list of movies
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Movie'
   */
  getAll(): IMovie[] {
    return jsonFileReader.readFileJson(moviesPath);
  }

  /**
   * @swagger
   * /api/movies/{id}:
   *   get:
   *     summary: Retrieve a movie by ID
   *     tags: [Movies]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the movie to retrieve
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: The movie object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Movie'
   */
  getOne(movieId: string): IMovie | undefined {
    const movies: IMovie[] = jsonFileReader.readFileJson(moviesPath);
    return movies.find((movie) => movie.id === movieId);
  }

  /**
   * @swagger
   * /api/movies:
   *   post:
   *     summary: Create a new movie
   *     tags: [Movies]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Movie'
   *     responses:
   *       200:
   *         description: Movie created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Movie'
   */
  create(movieData: any, imageFile: any): IMovie {
    const { title, year, description, genre, trailer } = movieData;

    const movies: IMovie[] = jsonFileReader.readFileJson(moviesPath);
    const lastId = movies.length > 0 ? movies[movies.length - 1].id : 0;
    let image = "no-image.jpg";

    const newMovie: IMovie = {
      id: uuidv4(),
      title,
      year,
      description,
      genre,
      trailer,
      image,
    };

    if (imageFile) {
      newMovie.image = FileService.save(imageFile);
    }

    movies.push(newMovie);
    jsonFileReader.writeFileJson(moviesPath, movies);
    return newMovie;
  }

  /**
   * @swagger
   * /api/movies/{id}:
   *   put:
   *     summary: Update an existing movie
   *     tags: [Movies]
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
   *             $ref: '#/components/schemas/Movie'
   *     responses:
   *       200:
   *         description: Movie updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Movie'
   */
  update(movieData: any, movieId: string, movieImage: any): IMovie | undefined {
    const { title, year, description, genre, trailer } = movieData;

    const movies: IMovie[] = jsonFileReader.readFileJson(moviesPath);

    const movieIndex = movies.findIndex((movie) => movie.id === movieId);

    if (movieIndex === -1) {
      return undefined;
    }

    const updatedMovie: IMovie = {
      id: movieId,
      title,
      year,
      description,
      genre,
      trailer,
      image: movies[movieIndex].image,
    };

    if (movieImage) {
      FileService.delete(movies[movieIndex].image);
      updatedMovie.image = FileService.save(movieImage);
    }

    movies[movieIndex] = updatedMovie;

    jsonFileReader.writeFileJson(moviesPath, movies);
    return updatedMovie;
  }

  /**
   * @swagger
   * /api/movies/{id}:
   *   delete:
   *     summary: Delete a movie
   *     tags: [Movies]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the movie to delete
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Movie deleted successfully
   *       404:
   *         description: Movie not found
   */
  delete(movieId: string): IMovie | undefined {
    const movies: IMovie[] = jsonFileReader.readFileJson(moviesPath);
    const movieIndex = movies.findIndex((movie) => movie.id === movieId);

    if (movieIndex === -1) {
      return undefined;
    }
    FileService.delete(movies[movieIndex].image);
    const deletedMovie = movies.splice(movieIndex, 1);

    jsonFileReader.writeFileJson(moviesPath, movies);
    return deletedMovie[0];
  }
}

export default new MovieService();
