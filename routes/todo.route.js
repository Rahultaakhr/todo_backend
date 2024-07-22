import { Router } from "express";
import { createTodo, deleteTodo, fetchAllTodo, updateTodo } from "../controllers/todo.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/create").post(verifyJWT,createTodo)
router.route("/update").post(verifyJWT, updateTodo)
router.route("/delete").post(verifyJWT, deleteTodo)
router.route("/all").get(verifyJWT,fetchAllTodo)
export { router }