import { useState } from "react";
import { toast } from "react-toastify";
import ReactStars from "react-stars";
import axios from "axios";

export default function CommentForm({ product }) {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [uploadedImage, setUploadedImage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment) {
            toast.error("Please add a comment.");
            return;
        }

        try {
            let image = "";
            if (uploadedImage) {
                const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
                const {
                    data: { signature, timestamp },
                } = await axios("/api/admin/cloudinary-sign");

                const formData = new FormData();
                const file = uploadedImage;

                formData.append("file", file);
                formData.append("signature", signature);
                formData.append("timestamp", timestamp);
                formData.append(
                    "api_key",
                    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
                );
                const { data: imageData } = await axios.post(url, formData);

                image = imageData.secure_url;
            }

            // Send the comment, rating, and product ID to the backend
            const { data } = await axios.post("/api/comments", {
                text: comment,
                rating,
                image,
                productId: product._id,
            });
            toast.success(data.message);
            setComment("");
            setRating(0);
        } catch (error) {
            console.log(error);
            // toast.error(error.response.data.message);
        }
    };

    const uploadHandler = (e) => {
        setUploadedImage(e.target.files[0]);
    };

    return (
        <div className="mt-5">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label
                        htmlFor="comment"
                        className="block text-sm font-medium text-gray-700">
                        Your Comment
                    </label>
                    <textarea
                        id="comment"
                        name="comment"
                        rows={4}
                        className="mt-1 p-2 w-full border rounded-md"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Rating
                    </label>
                    <ReactStars
                        count={5}
                        size={24}
                        color2={"#ffd700"}
                        onChange={(newRating) => setRating(newRating)}
                        value={rating}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Upload Photo
                    </label>
                    <input
                        type="file"
                        onChange={(e) => uploadHandler(e)}
                        className="mt-2"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Submit Comment
                    </button>
                </div>
            </form>
        </div>
    );
}
