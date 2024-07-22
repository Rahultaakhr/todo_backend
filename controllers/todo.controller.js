import { Todo } from "../models/todo.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTodo = asyncHandler(async (req, res) => {
    const { content } = req.body

    if (!content) {
        throw new apiError(401, "All fields are required")
    }

    const createdTodo = await Todo.create({

        content,
        createdBy: req.user?._id
    })
    return res
        .status(200)
        .json(
            new apiResponse(200, createdTodo, "Todo created successfully")
        )
})

const updateTodo = asyncHandler(async (req, res) => {
    const { _id,isCompleted } = req.body
    if (!isCompleted) {
        throw new apiError(401, "please update something")
    }
    const updatedTodo = await Todo.findOneAndUpdate(
        {
            _id
        },
        {
            isCompleted:isCompleted
        },
        {
            new: true
        }
    )
    return res
        .status(200)
        .json(
            new apiResponse(200, updatedTodo, "Todo updated successfully ")
        )
})

const deleteTodo = asyncHandler(async (req, res) => {
    const { _id } = req.body
    await Todo.findOneAndDelete(
        {
            _id
        },
        {
            new: true
        }
    )
    return res
        .status(200)
        .json(
            new apiResponse(200, {}, "Todo deleted successfully")
        )
})

const fetchAllTodo = asyncHandler(async (req, res) => {
    const todos = await Todo.find(
        {
            createdBy: req.user?._id
        }
    )

    return res
        .status(200)
        .json(
            new apiResponse(200, todos, "done")
        )
})
export { createTodo, updateTodo, deleteTodo, fetchAllTodo }