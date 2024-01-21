import { Router } from "express";
import userRouter from "./user.route.js";
import movieRouter from "./movie.route.js";
import languageRouter from "./language.route.js";
import categoryRouter from "./category.route.js";
import uploadRouter from "../controllers/uploadfile.js";
import downloadRouter from "../controllers/downloadcontroller.js";

const router = Router();

router.use("/users", userRouter);
router.use("/movies", movieRouter);
router.use("/language", languageRouter);
router.use("/category", categoryRouter);
router.use("/upload", uploadRouter);
// router.use("/", downloadRouter);

export default router;