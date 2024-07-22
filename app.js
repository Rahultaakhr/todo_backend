import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { router as todoRoute } from "./routes/todo.route.js";
import { router as userRoute } from "./routes/user.route.js";

const app = express();
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        Credential: true
    }
))
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.use("/api/users", userRoute)
app.use("/api/todo", todoRoute)
export { app }