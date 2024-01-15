import { Router } from "express";
import * as CategoriesController from "../controllers/category.controller.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
const categoryRouter = Router();
//*********** PUBLIC ROUTES *************/
categoryRouter.get("/", CategoriesController.getAllCategories);
//*************ADMIN ROUTES *************/
categoryRouter.post("/", isAuthenticated, isAdmin, CategoriesController.createCategory);
categoryRouter.put("/:id", isAuthenticated, isAdmin, CategoriesController.updateCategory);
categoryRouter.delete("/:id", isAuthenticated, isAdmin, CategoriesController.deleteCategory);
export default categoryRouter;
