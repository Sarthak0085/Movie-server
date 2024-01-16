import Movie from "../models/movie.model.js";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../models/user.model.js";

//get movies
export const getMovies = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // filter movies by category, time, rate, language, search and year
        const { category, time, rating, language, year, search } = req.query;
        let query = {
            ...(category && { category }),
            ...(time && { time }),
            ...(language && { language }),
            ...(rating && { rating }),
            ...(year && { year }),
            ...(search && { name: { $regex: search, $option: "i" } })
        }

        //load more movies functionality
        const page = Number(req.query.pageNumber) || 1; //if page number is not provided then it set to be 1
        const limit = 2; // 2 movies /page
        const skip = (page - 1) * limit; // skip 2 movies/ page

        //find movies by query, skip and limit
        const movies = await Movie.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        //get total number of movies
        const count = await Movie.countDocuments(query);

        //send response with movies and total number of movies
        res.status(201).json({
            success: true,
            movies,
            page,
            pages: Math.ceil(count / limit), // total number of pages
            totalMovies: count, // total movies count
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


//****************** Private Controllers ***********************


// get movie by id 
export const getMovieById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // find movie by id
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return next(new ErrorHandler("Movie Not Found", 404));
        }

        res.status(201).json({
            success: true,
            movie
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//get top rated movies
export const getTopRatedMovies = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // find top rated movies
        const movies = await Movie.find({}).sort({ rating: -1 });
        res.status(201).json({
            success: true,
            movies
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


//get random movies
export const getRandomMovies = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get random movies
        const movies = await Movie.aggregate([{ $sample: { size: 8 } }]);
        // send random movies to client
        res.status(201).json({
            success: true,
            movies
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//create movie review
export const createMovieReview = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    console.log("  " + req.userId);

    const { rating, comment } = req.body;
    try {
        // find movie by id in database
        const user = await User.findById(req.userId);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const movie = await Movie.findById(req.params.id);

        // check if movie exist then add review in it
        if (movie) {
            // check if the user already reviewed the movie

            const alreadyReviewed = movie.reviews.find(
                (r: any) => r.userId.toString() == user._id
            );

            if (alreadyReviewed) {
                return next(new ErrorHandler("Already Reviewed", 401));
            }


            // create new review
            const review = {
                userName: user.userName,
                userId: user._id,
                userImage: user.image,
                rating: Number(rating),
                comment,
            }

            // push new review into the reviews array
            movie.reviews.push(review);
            // increment the number of reviews
            movie.numOfReviews = movie.reviews.length;

            // calculate the new rate
            // @ts-ignore
            movie.rating = movie.reviews.reduce((acc, item) => item.rating + acc, 0) / movie.reviews.length;

            await movie.save();

            //send the new movie to the client
            res.status(201).json({
                success: true,
                message: "Review added",
            })
        }
        else {
            return next(new ErrorHandler("Movie not found", 404))
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// ***************** Admin **********************

//create new movie
export const createMovie = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get data from request body
        const {
            name,
            desc,
            image,
            titleImage,
            rating,
            category,
            numOfReviews,
            time,
            language,
            year,
            video,
            casts
        } = req.body;

        // create a new movie 
        const movie = new Movie({
            name,
            desc,
            image,
            titleImage,
            rating,
            category,
            numOfReviews,
            time,
            language,
            year,
            video,
            casts,
            userId: req.userId
        })

        // if movie created then save it in database
        if (movie) {
            await movie.save();
            res.json(movie);
        }
        else {
            return next(new ErrorHandler("Invalid Movie data", 400));
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// update a movie
export const updateMovie = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get data from request body
        const {
            name,
            desc,
            image,
            titleImage,
            rating,
            category,
            numOfReviews,
            time,
            language,
            year,
            video,
            casts
        } = req.body;
        // get movie by id
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return next(new ErrorHandler("Movie not found", 404));
        }
        // if movie exist then update the movie
        movie.name = name || movie.name;
        movie.desc = desc || movie.desc;
        movie.image = image || movie.image;
        movie.titleImage = titleImage || movie.titleImage;
        movie.category = category || movie.category;
        movie.rating = rating || movie.rating;
        movie.numOfReviews = numOfReviews || movie.numOfReviews;
        movie.time = time || movie.time;
        movie.language = language || movie.language;
        movie.year = year || movie.year;
        movie.video = video || movie.video;
        movie.casts = casts || movie.casts;

        //save movie in database
        const updateMovie = await movie.save();

        res.status(201).json({
            success: true,
            updateMovie
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//delete a movie
export const deleteMovie = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // find movie in the database
        const movie = await Movie.findByIdAndDelete(req.params.id);

        if (!movie) {
            return next(new ErrorHandler("Movie not found", 400));
        }

        res.json({
            success: true,
            message: "Movie Removed from database"
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//delete all movies
export const deleteAllMovie = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleteAll = await Movie.deleteMany({});
        res.status(201).json({
            success: true,
            message: "All movies deleted"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
