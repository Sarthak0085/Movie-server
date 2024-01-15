import { NextFunction, Request, Response } from "express";
import Categories from "../models/category.model.js";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

//*********** Public Controller ******************/

// get all categories
export const getAllCategories = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // find all categories in databse
        const categories = await Categories.find({});

        res.json(categories);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//********** Admin Controller *********************/

//create new category

export const createCategory = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get request from the body
        const { title } = req.body;
        // craete category
        const category = new Categories({
            title,
        });
        //save this to database
        const createdCategory = await category.save();
        //send new category to the client
        res.status(201).json({
            success: true,
            createdCategory
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// upadte category
export const updateCategory = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await Categories.findById(req.params.id);
        // if ctaegory is found then update the category
        if (!category) {
            return next(new ErrorHandler("Category not found", 404));
        }

        category.title = req.body.title || category.title;
        const updatedCategory = await category.save();
        res.status(201).json({
            success: true,
            updatedCategory
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// delete category
export const deleteCategory = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get category from request params id
        const category = await Categories.findByIdAndDelete(req.params.id);
        // if ctaegory is found then delete the category
        if (!category) {
            return next(new ErrorHandler("Category not found", 404));
        }

        res.status(201).json({
            success: true,
            message: "Category Removed"
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
