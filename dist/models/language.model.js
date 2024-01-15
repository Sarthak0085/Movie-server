import mongoose from "mongoose";
const languageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});
export default mongoose.model("Language", languageSchema);
