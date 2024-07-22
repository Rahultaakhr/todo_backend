import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
}
const registerUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        throw new apiError(401, "All fields are required")
    }
    const existedUser = await User.findOne({
        username
    })
    if (existedUser) {
        throw new apiError(401, "user already exist with username")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        password
    })
    const createdUser = await User.findOne(user?._id).select("-password -refreshToken")
    console.log("created ", createdUser);

    return res
        .status(200)
        .json(
            new apiResponse(200, createdUser, "user register successfully")
        )

})
const userLogin = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    
    if (!username || !password) {
        throw new apiError(401, "All fields are required")
    }

    const user = await User.findOne({ username })
    if (!user) {
        throw new apiError(401, "user not found")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new apiError(401, "Invalid user credentials")
    }
    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id)
    const option = {
        httpOnly: true,
        secure: true
    }
    const loggedUser = await User.findById(user._id).select("-password -refreshToken")
    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new apiResponse(200,  loggedUser , "user logged in successfully")
        )

})

const userLogout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new apiResponse(200, {}, "user logout successfully")
        )
})
export { registerUser, userLogin,userLogout }