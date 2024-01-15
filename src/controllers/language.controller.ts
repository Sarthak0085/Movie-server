import { NextFunction, Request, Response } from "express";
import Language from "../models/language.model.js";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

//*********** Public Controller ******************/

// get all Language
export const getAllLanguages = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // find all Language in databse
        const languages = await Language.find({});

        res.status(201).json({
            success: true,
            languages
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//********** Admin Controller *********************/

//add new language

export const addNewLanguage = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title } = req.body;
        const language = new Language({
            title,
        });
        const addLanguage = await language.save();
        res.status(201).json({
            success: true,
            addLanguage
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// upadte language
export const updateLanguage = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = await Language.findById(req.params.id);
        // if ctaegory is found then update the category
        if (!language) {
            return next(new ErrorHandler("Category not found", 404));
        }

        language.title = req.body.title || language.title;
        const updatedLanguage = await language.save();
        res.status(201).json({
            success: true,
            updatedLanguage
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// delete language
export const deleteLanguage = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = await Language.findByIdAndDelete(req.params.id);
        if (!language) {
            return next(new ErrorHandler("Category not found", 404));
        }

        res.status(201).json({
            success: true,
            message: "Language Removed"
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
