import mongoose from "mongoose";
import { UserType } from "../types/type.js";

const UserSchema = new mongoose.Schema<UserType>({
    firstName: {
        type: String,
        required: [true, "Please enter your first name"],
    },
    lastName: {
        type: String,
        required: [true, "Please enter your last name"],
    },
    userName: {
        type: String,
        required: [true, "Please enter your user name"],
    },
    age: {
        type: Number,
        required: [true, "Please enter your age"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please enter the password"],
        minlength: [8, "Password must be atleast 8 characters"],
    },
    image: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    likedMovies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",

        }
    ],
    likedCategories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",

        }
    ]
}, {
    timestamps: true,
});

const User = mongoose.model<UserType>("User", UserSchema);

export default User;