import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from "path";
import { v4 as uuidv4 } from "uuid";
import storage from '../config/firebaseStorage.js';
import ErrorHandler from '../utils/ErrorHandler.js';

const uploadRouter = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
});

uploadRouter.post("/", upload.single("file"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        //get file fom request
        const file = req.file;
        // create new filename
        if (file) {
            const fileName = `${uuidv4()}${path.extname(file.originalname)}`;

            const blob = storage.file(fileName);
            const blobStream = blob.createWriteStream({
                resumable: false,
                metadata: {
                    contentType: file.mimetype,
                }
            });

            // if error
            blobStream.on("error", (error: any) => {
                return next(new ErrorHandler(error.message, 400));
                // res.status(400).json({ message: error.message });
            });

            //if success
            blobStream.on("finish", () => {
                // get the public url
                const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.name}/o/${fileName}?alt=media`;
                // return filename and public url to the client
                res.status(200).json(publicUrl);
            });
            blobStream.end(file.buffer);
        }
        else {
            return next(new ErrorHandler("Please upload a file", 400));
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


export default uploadRouter;