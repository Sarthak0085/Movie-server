import { Router } from "express";
import * as movieController from "../controllers/movie.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.js";
const movieRouter = Router();
/************* PUBLIC ROUTES ***********/
movieRouter.get("/", movieController.getMovies);
movieRouter.get("/:id", movieController.getMovieById);
movieRouter.get("/rated/top", movieController.getTopRatedMovies);
movieRouter.get("/random/all", movieController.getRandomMovies);
/************* PRIVATE ROUTES **********/
movieRouter.post("/reviews/:id", isAuthenticated, movieController.createMovieReview);
/************** ADMIN ROUTES **********/
movieRouter.post("/", isAuthenticated, isAdmin, movieController.createMovie);
movieRouter.put("/:id", isAuthenticated, isAdmin, movieController.updateMovie);
movieRouter.delete("/:id", isAuthenticated, isAdmin, movieController.deleteMovie);
movieRouter.delete("/", isAuthenticated, isAdmin, movieController.deleteAllMovie);
export default movieRouter;
