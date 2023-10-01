import { getSession } from "next-auth/react";
import Comment from "../../../models/Comment";
import db from "../../../utils/db";

const handler = async (req, res) => {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).send("Signin required");
    }

    if (req.method === "GET") {
        return getHandler(req, res);
    } else if (req.method === "POST") {
        return postHandler(req, res, session.user);
    } else {
        return res.status(400).send({ message: "Method not allowed" });
    }
};

const getHandler = async (req, res) => {
    await db.connect();
    const productId = req.query.productId;
    const comments = await Comment.find({ product: productId })
        .populate("user", "firstName lastName userName") // Updated this line
        .exec();
    await db.disconnect();
    res.send(comments);
};

const postHandler = async (req, res, user) => {
    await db.connect();
    const { text, rating, image, productId } = req.body;
    if (!text || !rating || !productId) {
        return res.status(400).send({
            message: "Comment text, rating, and product ID are required",
        });
    }

    const newComment = new Comment({
        user: user._id,
        product: productId,
        text,
        rating,
        image,
    });

    const comment = await newComment.save();
    await db.disconnect();
    res.send({ message: "Comment created successfully", comment });
};

export default handler;
