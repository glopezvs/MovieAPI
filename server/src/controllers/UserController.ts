import { validationResult } from "express-validator";
import fileService from "../utils/FileService.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

class UserController {
  /**
   * @swagger
   * /auth/users:
   *   get:
   *     summary: Get all users
   *     description: Get a list of all users
   *     tags:
   *       - Users
   *     responses:
   *       200:
   *         description: A list of users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/UserInput'
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserModel.find();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: "internal Server Error" });
    }
  }

  /**
   * @swagger
   * /auth/users/{id}:
   *   get:
   *     summary: Get a user by ID
   *     description: Get a single user by its ID
   *     tags:
   *       - Users
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the user to retrieve
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A single user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserInput'
   *       404:
   *         description: User not found
   */
  async getUserById(req: Request, res: Response) {
    try {
      const user = await UserModel.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "internal Server Error" });
    }
  }

  /**
   * @swagger
   * /auth/users/register:
   *   post:
   *     summary: Register a new user
   *     description: Register a new user with provided details
   *     tags:
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserInput'
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserInput'
   *       400:
   *         description: User already exists
   *       422:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       value:
   *                         type: string
   *                       msg:
   *                         type: string
   *                       param:
   *                         type: string
   */
  async registerUser(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      const errors = validationResult(req);

      const foundUser = await UserModel.findOne({ email });

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      if (foundUser) {
        return res.status(400).json({ error: "User already exists." });
      }
      let avatar = "default.png";

      if (req.files?.avatar) {
        avatar = fileService.save(req.files?.avatar);
      }

      const newUser = new UserModel({
        name,
        email: email.trim(),
        password: bcrypt.hashSync(password.trim(), 7),
        avatar,
        role,
      });
      newUser.save();

      const payload = {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      };
      const token = jwt.sign(payload, String(SECRET_KEY));
      return res.status(201).json({ user: newUser, accessToken: token });
    } catch (error) {
      return res.status(500).json({ error: "internal Server Error" });
    }
  }

  /**
   * @swagger
   * /auth/users/login:
   *   post:
   *     summary: Log in as a user
   *     description: Log in with email and password
   *     tags:
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: User logged in successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/UserInput'
   *                 accessToken:
   *                   type: string
   *       400:
   *         description: Invalid password
   *       404:
   *         description: User not found
   *       422:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       value:
   *                         type: string
   *                       msg:
   *                         type: string
   *                       param:
   *                         type: string
   */
  async loginUser(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const foundUser = await UserModel.findOne({ email });

      if (!foundUser) {
        return res.status(404).json({ error: "User not found." });
      }
      if (!bcrypt.compareSync(password, foundUser.password)) {
        return res.status(400).json({ error: "Invalid password." });
      }

      const payload = {
        id: foundUser._id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
      };

      const token = jwt.sign(payload, String(SECRET_KEY));

      return res.json({ user: foundUser, accessToken: token });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @swagger
   * /auth/users/{id}:
   *   put:
   *     summary: Update a user
   *     description: Update a user by ID
   *     tags:
   *       - Users
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the user to update
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserInput'
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserInput'
   *       404:
   *         description: User not found
   *       422:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       value:
   *                         type: string
   *                       msg:
   *                         type: string
   *                       param:
   *                         type: string
   */
  async updateUser(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const { name, email, password, role } = req.body;
      const user = await UserModel.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      let avatar = user.avatar;

      if (req.files?.avatar) {
        if (user.avatar && user.avatar !== "default.png") {
          fileService.delete(user.avatar);
        }
        avatar = fileService.save(req.files?.avatar);
      }

      user.name = name;
      user.email = email;
      user.password = bcrypt.hashSync(password.trim(), 7);
      user.avatar = avatar;
      user.role = role;

      await user.save();

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @swagger
   * /auth/users/{id}:
   *   delete:
   *     summary: Delete a user
   *     description: Delete a user by ID
   *     tags:
   *       - Users
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the user to delete
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       404:
   *         description: User not found
   */
  async deleteuser(req: Request, res: Response) {
    try {
      const deletedUser: any = await UserModel.findByIdAndDelete(req.params.id);

      if (!deletedUser) {
        return res.status(404).json({ error: "User not found." });
      }

      if (deletedUser.avatar !== "default.png") {
        fileService.delete(deletedUser.avatar);
      }
      return res.json({ message: "User deleted successfully." });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @swagger
   * /auth/users/search:
   *   get:
   *     summary: Search users
   *     description: Search users by query string
   *     tags:
   *       - Users
   *     parameters:
   *       - in: query
   *         name: query
   *         schema:
   *           type: string
   *         description: Search query
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Number of results per page
   *     responses:
   *       200:
   *         description: A list of users matching the search query
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/UserInput'
   *       422:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       value:
   *                         type: string
   *                       msg:
   *                         type: string
   *                       param:
   *                         type: string
   */
  async searchUser(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const { query, page = 1, limit = 10 } = req.query as any;
      const users = await UserModel.find()
        .skip((page - 1) * limit)
        .limit(limit);
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: "internal Server Error" });
    }
  }
}
export default new UserController();
