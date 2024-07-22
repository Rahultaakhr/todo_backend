import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();
        const salt_round = 10;
        this.password = await bcrypt.hash(this.password, salt_round)
        next()
    } catch (error) {
        console.log(error);
    }

})

userSchema.methods.isPasswordCorrect = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw new Error(error)
    }
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id

        }, process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
        }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
export const User = new mongoose.model("User", userSchema)
