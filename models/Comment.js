import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        rating: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Comment =
    mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;
