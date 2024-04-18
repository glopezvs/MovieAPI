import { Router } from "express";
import { check } from "express-validator";
import UserController from "../controllers/UserController.js";

const router = Router();
/**
 * @swagger
 * tags:
 *  name: Users
 *  description: API endpoints for managing users
 */

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *               $ref: '#/components/schemas/UserInput'
 */
// Get all users
router.get("/users", UserController.getAllUsers);

/**
 * @swagger
 * /auth/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrive
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: The user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserInput'
 *       500:
 *         description: Internal server error
 */

// Get a user by ID
router.get("/users/:id", UserController.getUserById);

// Register a new user
/**
 * @swagger
 * /auth/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *     responses:
 *       200:
 *         description: User successfully registered
 *       400:
 *         description: Bad request
 */
router.post(
  "/users/register",
  [
    check("name").notEmpty().withMessage("Invalid email."),
    check("email").isEmail().withMessage("Name is required."),
    check("password")
      .isStrongPassword()
      .withMessage(
        "minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1"
      ),
    check("role").isIn(["USER", "ADMIN"]).withMessage("Invalid role."),
  ],
  UserController.registerUser
);

// Login
/**
 * @swagger
 * /auth/users/login:
 *   post:
 *     summary: Login
 *     tags: [Users]
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
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/users/login",
  [
    check("email").isEmail().withMessage("Invalid email."),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 chars long."),
  ],
  UserController.loginUser
);

// Update an existing user
/**
 * @swagger
 * /auth/users/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [Users]
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
router.put(
  "/users/:id",
  [
    check("name").notEmpty().withMessage("Invalid email."),
    check("email").isEmail().withMessage("Name is required."),
    check("password")
      .isStrongPassword()
      .withMessage(
        "minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1"
      ),
    check("role").isIn(["USER", "ADMIN"]).withMessage("Invalid role."),
  ],
  UserController.updateUser
);

// Delete a user
/**
 * @swagger
 * /auth/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
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
 *       404:
 *         description: User not found
 */
router.delete("/users/:id", UserController.deleteuser);

export default router;
