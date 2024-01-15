import { Router } from "express";
import * as LanguageController from "../controllers/language.controller.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const languageRouter = Router();


//*********** PUBLIC ROUTES *************/
languageRouter.get("/", LanguageController.getAllLanguages);

//*************ADMIN ROUTES *************/
languageRouter.post("/", isAuthenticated, isAdmin, LanguageController.addNewLanguage);
languageRouter.put("/:id", isAuthenticated, isAdmin, LanguageController.updateLanguage);
languageRouter.delete("/:id", isAuthenticated, isAdmin, LanguageController.deleteLanguage);

export default languageRouter;