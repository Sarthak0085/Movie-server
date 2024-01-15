import express from 'express';
import storage from '../config/firebaseStorage.js';
import ErrorHandler from '../utils/ErrorHandler.js';
const downloadRouter = express.Router();
downloadRouter.get("/:fileName", async (req, res, next) => {
    try {
        const fileName = req.params.fileName;
        console.log(fileName);
        // Get a signed URL for the file
        const [url] = await storage.file(fileName).getSignedUrl({
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
        });
        // Redirect the user to the signed URL for download
        res.redirect(url);
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
export default downloadRouter;
