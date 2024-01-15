import { Types } from "mongoose";

export interface UserType extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    age: number;
    password: string;
    image?: string;
    isAdmin: boolean;
    likedMovies: Types.ObjectId[];
    likedCategories: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}