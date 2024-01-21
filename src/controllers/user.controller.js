import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middlewares/auth.js";
import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

//register user
export const registerUser = catchAsyncError(async (req, res, next) => {
    const { firstName, lastName, userName, age, email, password, image } = req.body;
    try {
        const isUserExist = await User.findOne({ email });

        // if user exist
        if (isUserExist) {
            return next(new ErrorHandler("User Already Exist", 401));
        }

        // hash password
        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create user in db
        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            age,
            password: hashedPassword,
            image,
        });

        // if user created then send user data and token to client
        if (user) {
            res.status(201).json({
                success: true,
                user,
                token: generateToken(user),
            });
        } else {
            return next(new ErrorHandler("Invalid User data", 400));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//login user
export const loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        // if user exist
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        // if user created then send user data and token to client
        if (user && !isPasswordCorrect) {
            return next(new ErrorHandler("Invalid User Credentials", 403));
        }

        res.status(201).json({
            success: true,
            user,
            token: generateToken(user),
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//updating user profile using private routes
export const updateUserProfile = catchAsyncError(async (req, res, next) => {
    const { firstName, lastName, userName, email, image } = req.body;
    try {
        //find user in Db
        // console.log(req.body);

        const user = await User.findById(req.userId);
        // console.log(req.userId);


        // if user exists updated user data and save data in db

        if (user) {
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.userName = userName || user.userName;
            user.email = email || user.email;
            user.image = image || user.image;

            const updatedUser = await user.save();
            //s
            res.status(201).json({
                success: true,
                user: updatedUser,
                token: generateToken(updatedUser),
            });
        } else {
            return next(new ErrorHandler("User not found", 404));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//deleteing user using private routes
export const deleteUser = catchAsyncError(async (req, res, next) => {
    try {
        //find user in Db
        const user = await User.findById(req.userId);

        if (!user) {
            return next(new ErrorHandler("User doesn't Exist", 404));
        }

        if (user.isAdmin) {
            return next(new ErrorHandler("Can't delete Admin", 400));
        }

        await User.deleteOne({ email: user.email });
        res.status(201).json({
            success: true,
            message: "User deleted Successfully"
        });

        // if (user) {
        //     // if user is Admin then throw error
        //     if (isAdmin) {
        //         res.status(400);
        //         throw new Error("Can't delete Admin");
        //     }

        //     await User.remove();

        // } else {
        //     res.status(404);
        //     throw new Error("User Not Found");
        // }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// change user password
//deleteing user using private routes
export const changePassword = catchAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    try {
        //find user in Db
        const user = await User.findById(req.userId);

        // if user exists then compare its old password

        if (user && (await bcrypt.compare(oldPassword, user.password))) {
            // hash new password
            const salt = await bcrypt.genSalt(15);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;

            await user.save();
            res.status(201).json({
                success: true,
                message: "Password changed!!"
            });
        } else {
            return next(new ErrorHandler("Old password doesn't match", 403));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//add or remove liked movie
export const addOrRemoveLikedMovie = catchAsyncError(async (req, res, next) => {
    const { movieId } = req.body;
    try {
        // find user in db
        const user = await User.findById(req.userId);
        console.log("movieId :" + movieId);

        // if user exists then add movies to liked movies and save it in db
        if (user) {
            // if movie already liked then remove it from liked movies
            console.log(user.likedMovies);

            console.log(user.likedMovies.includes(movieId));

            // const isLiked = await User.

            if (user && user.likedMovies.includes(movieId)) {
                const index = user.likedMovies.indexOf(movieId);
                user.likedMovies.splice(index, 1);
                await user.save();
            } else {
                user.likedMovies.push(movieId);
                // console.log(user);
                await user.save();
            }
            // console.log(user.likedMovies);


            // else add movie to liked movies


            res.status(201).json({
                success: true,
                likedMovies: user.likedMovies
            })
        }
        //else throw error
        else {
            return next(new ErrorHandler("User not found", 404));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//get liked movies 
export const getAllLikedMovies = catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).populate("likedMovies");
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const likedMovies = user.likedMovies;



        if (!likedMovies) {
            return next(new ErrorHandler("Favourites is Empty", 400));
        }

        // console.log("Liked" + likedMovies);


        return res.status(201).json({
            success: true,
            likedMovies
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
})

//get liked movies 
export const getAllLikedCategories = catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const getLikedCategories = user.likedCategories;
        if (!getLikedCategories) {
            return next(new ErrorHandler("Favourites is Empty", 400));
        }

        return res.status(201).json({
            success: true,
            getLikedCategories
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
})

//add or remove liked category
export const addOrRemoveLikedCategory = catchAsyncError(async (req, res, next) => {
    const { movieId } = req.body;
    try {
        // find user in db
        const user = await User.findById(req.userId);
        // if user exists then add movies to liked movies and save it in db
        if (user) {
            // if movie already liked then remove it from liked movies
            if (user.likedCategories.includes(movieId)) {
                const index = user.likedCategories.indexOf(movieId);
                user.likedCategories.splice(index, 1);
                await user.save();
            }

            // else add movie to liked movies
            user.likedCategories.push(movieId);
            await user.save();

            res.status(201).json({
                success: true,
                likedCategories: user.likedCategories
            })
        }
        //else throw error
        else {
            return next(new ErrorHandler("User not found", 404));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// remove all liked movies using private route
export const removeAlllikedMovies = catchAsyncError(async (req, res, next) => {
    try {
        // find user in db
        const user = await User.findById(req.userId);
        // if user found then remove all its liked movies
        if (user) {
            user.likedMovies = [];
            await user.save();
            res.status(201).json({
                success: true,
                message: "All liked movies deleted successfully"
            });
        }
        //else throw error
        else {
            return next(new ErrorHandler("User not found", 404));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 404));
    }
});

// remove all liked movies using private route
export const removeAlllikedCategories = catchAsyncError(async (req, res, next) => {
    try {
        // find user in db
        const user = await User.findById(req.userId);
        // if user found then remove all its liked movies
        if (user) {
            user.likedCategories = [];
            await user.save();
            res.status(201).json({
                success: true,
                message: "All liked categories deleted successfully"
            });
        }
        //else throw error
        else {
            return next(new ErrorHandler("User not found", 404));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 404));
    }
});

// ****************** Admin Controller ******************

//get all users 
export const getAllUsers = catchAsyncError(async (req, res, next) => {
    try {
        //get all users
        const users = await User.find();
        res.status(201).json({
            success: true,
            users
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const deleteUserByAdmin = catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorHandler("User Not Found", 404));
        }

        if (user.isAdmin === true) {
            res.status(400);
            throw new Error("Can't delete Admin");
        }

        await User.deleteOne({ email: user.email });
        res.status(201).json({
            success: true,
            message: "User deleted Successfully"
        });

        // if (user) {
        //     // if user is Admin then throw error
        //     if (isAdmin) {
        //         res.status(400);
        //         throw new Error("Can't delete Admin");
        //     }


        // } else {
        //     res.status(404);
        //     throw new Error("User Not Found");
        // }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

