import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";
import { catchAsyncError } from './catchAsyncErrors.js';
import ErrorHandler from '../utils/ErrorHandler.js';
// authenticated user and get token
const generateToken = (user) => {
    const payload = { user };
    return jwt.sign(payload, process.env.JWT_SECRET || "bnncxdfcd7tyg", {
        expiresIn: "1d"
    });
};
//protection or authorized middleware
const isAuthenticated = catchAsyncError(async (req, res, next) => {
    let token;
    //check if token exists
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            if (!token) {
                return next(new ErrorHandler("Not Authorized", 401));
            }
            // console.log(token);
            // verify token
            // const decoded = jwt.verify(token, process.env.JWT_SECRET || "bnncxdfcd7tyg");
            //get user id from decoded token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
            // console.log(decoded);
            req.userId = decoded?.user?._id;
            console.log(decoded?.user?._id);
            // req.userId = await User.findOne(decoded.id).select("-password");
            return next();
        }
        catch (error) {
            return next(new ErrorHandler(error.message, 401));
        }
    }
});
// admin middleawre
const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    if (!user?.isAdmin) {
        return next(new ErrorHandler("Not Authorized as an admin", 400));
    }
    return next();
};
export { generateToken, isAuthenticated, isAdmin, };
