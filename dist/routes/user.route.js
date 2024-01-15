import express from "express";
import * as userController from "../controllers/user.controller.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
const userRouter = express.Router();
/*************** PUBLIC ROUTES ******************/
userRouter.post("/", userController.registerUser);
userRouter.post("/login", userController.loginUser);
/*************** PRIVATE ROUTES ******************/
userRouter.put("/", isAuthenticated, userController.updateUserProfile);
userRouter.delete("/", isAuthenticated, userController.deleteUser);
userRouter.put("/password", isAuthenticated, userController.changePassword);
userRouter.get("/favourites", isAuthenticated, userController.getAllLikedMovies);
userRouter.put("/favourites", isAuthenticated, userController.addOrRemoveLikedMovie);
userRouter.delete("/favourites", isAuthenticated, userController.removeAlllikedMovies);
userRouter.get("/favourites/category", isAuthenticated, userController.getAllLikedCategories);
userRouter.put("/favourites/category", isAuthenticated, userController.addOrRemoveLikedCategory);
userRouter.delete("/favourites/category/all", isAuthenticated, userController.removeAlllikedCategories);
/*************** ADMIN ROUTES ******************/
userRouter.get("/", isAuthenticated, isAdmin, userController.getAllUsers);
userRouter.delete("/:id", isAuthenticated, isAdmin, userController.deleteUser);
export default userRouter;
